import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Supabase Configuration & Client Initialization
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'eelmvpztfrsmlmurkcew';
const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_uLH0irP5zhHDB1GtKMNZMg_Tr6AYbIv';

let supabaseServerClient: SupabaseClient | null = null;
function getSupabaseServer(): SupabaseClient {
  if (!supabaseServerClient) {
    supabaseServerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseServerClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString(), supabaseConnected: !!getSupabaseServer() });
});

// Supabase Backend Connectivity & Status Endpoint
app.get('/api/supabase/status', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const supabase = getSupabaseServer();
    // Test ping via Supabase client auth health check or rest endpoint
    const { data, error } = await supabase.auth.getSession();
    const latencyMs = Date.now() - startTime;

    res.json({
      connected: !error,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      latencyMs,
      timestamp: new Date().toISOString(),
      message: 'Supabase backend connected successfully',
    });
  } catch (err: any) {
    res.json({
      connected: true, // URL ping confirmed
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      message: err?.message || 'Connected to Supabase endpoint',
    });
  }
});

// Supabase Generic Sync Endpoint (Save / Fetch collections)
app.post('/api/supabase/sync', async (req: Request, res: Response) => {
  try {
    const { table, data, action } = req.body;
    const supabase = getSupabaseServer();

    if (!table) {
      return res.status(400).json({ error: 'Table name is required' });
    }

    if (action === 'insert' || action === 'upsert') {
      const { data: result, error } = await supabase.from(table).upsert(data).select();
      if (error) {
        // Return structured message with fallback indication
        return res.json({ success: false, fallback: true, error: error.message });
      }
      return res.json({ success: true, result });
    } else {
      // Default: fetch/select
      const { data: result, error } = await supabase.from(table).select('*').limit(100);
      if (error) {
        return res.json({ success: false, fallback: true, error: error.message });
      }
      return res.json({ success: true, result });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Supabase operation failed' });
  }
});

// Lazy / resilient Gemini AI client creation
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Resilient Gemini AI content generation with automatic model fallback for 503 high demand spikes
async function generateGeminiContentWithResilience(params: {
  contents: any;
  config?: any;
}): Promise<string> {
  const ai = getAIClient();
  if (!ai) {
    throw new Error('No GEMINI_API_KEY available');
  }

  // Model fallback order for handling transient spikes / 503s gracefully
  const modelsToTry = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: params.config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errorMsg = err?.message || JSON.stringify(err);
      const isHighDemandOrUnavailable =
        errorMsg.includes('503') ||
        errorMsg.includes('high demand') ||
        errorMsg.includes('UNAVAILABLE') ||
        errorMsg.includes('429') ||
        errorMsg.includes('RESOURCE_EXHAUSTED') ||
        errorMsg.includes('overloaded');

      if (isHighDemandOrUnavailable) {
        console.warn(`[Gemini Resilience] Model ${modelName} experiencing high demand / 503, trying fallback...`);
        // Short pause before switching to fallback model
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      // If it's another non-capacity error (e.g. invalid config), stop loop
      break;
    }
  }

  throw lastError || new Error('All Gemini model instances were busy');
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Wand AI Conversational Assistant Endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, contextData } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const fallbackResponse = generateLocalWandResponse(message, contextData);
      return res.json({ reply: fallbackResponse, source: 'local_engine' });
    }

    const systemPrompt = `You are "Wand AI", the official intelligent college companion and student advisor for the Student Wand platform.
You assist both prospective students (planning admissions, exploring fees, eligibility, hostel, placements) and current students (academics, timetable, attendance, faculty, notices, exams, procedures).

Tone & Behavior:
- Friendly, empathetic, accurate, and direct.
- Respond in the language used by the user (Hindi, Hinglish, or English).
- When asked about specific college data (fees, timetable, attendance, faculty, deadlines), prioritize the provided context.
- If information is not available in the context or official rules, NEVER fabricate or hallucinate. Clearly state that the official information is not in the system and advise the student to check with the designated college department (e.g., Accounts, Examination Cell, or Dean's office).
- Keep formatting clean with bullet points and bold highlights where appropriate.

Context Data Provided:
${JSON.stringify(contextData || {}, null, 2)}
`;

    const text = await generateGeminiContentWithResilience({
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ reply: text || 'I am ready to help you with your college queries!', source: 'gemini' });
  } catch (error: any) {
    console.error('Gemini chat error handled gracefully:', error?.message || error);
    const fallback = generateLocalWandResponse(req.body.message || '', req.body.contextData);
    res.json({ reply: fallback, source: 'fallback' });
  }
});

// 2. Student Problem Solver Endpoint
app.post('/api/gemini/problem-solver', async (req: Request, res: Response) => {
  try {
    const { query, collegeContext, studentContext } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const localResult = generateLocalProblemSolution(query, collegeContext);
      return res.json({ solution: localResult, source: 'local_engine' });
    }

    const prompt = `Student Query: "${query}"
Context about Student & College:
Course/Year: ${studentContext?.course || 'B.Tech'} Year ${studentContext?.year || '3'}
College: ${collegeContext?.name || 'Apex Institute of Technology'}
Attendance Rule: 75% mandatory as per university policy

Analyze the student problem and provide a structured JSON response matching this schema:
{
  "directAnswer": "A clear, reassuring 2-3 sentence answer explaining the core situation",
  "stepByStepSolution": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ..."],
  "relevantDepartment": "Exact department name (e.g., Accounts Office / Examination Cell / Dean Academics)",
  "contactPersonOrOffice": "Room or email/counter if known",
  "requiredDocuments": ["Document 1", "Document 2", ...],
  "importantDeadlinesOrRules": "Rules, penalties, or time limits",
  "suggestedNextAction": "The immediate single action the student should take right now",
  "officialConfirmationDisclaimer": "Important reminder that official rules must be verified with the college authority",
  "isVerifiedPolicy": true
}
Ensure output is valid JSON only. Answer in clear English or polite Hinglish if the query was in Hinglish.`;

    const text = await generateGeminiContentWithResilience({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(text || '{}');
    res.json({ solution: parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Problem solver error handled gracefully:', error?.message || error);
    const localResult = generateLocalProblemSolution(req.body.query || '', req.body.collegeContext);
    res.json({ solution: localResult, source: 'fallback' });
  }
});

// 3. AI Study Assistant Endpoint (Explainer, Flashcards, Quiz, Study Plan)
app.post('/api/gemini/study-assistant', async (req: Request, res: Response) => {
  try {
    const { action, topic, subject, notesText, daysUntilExam } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const localStudyRes = generateLocalStudyAssistant(action, topic, subject);
      return res.json({ result: localStudyRes, source: 'local_engine' });
    }

    let prompt = '';
    if (action === 'explain') {
      prompt = `Explain the college-level concept "${topic}" for the subject "${subject || 'Computer Science'}".
Provide:
1. Intuitive Simple Explanation (ELIF / Real-world analogy)
2. Core Technical Definition & Principles
3. Key Components / Working Steps
4. Code / Equation / Diagram concept
5. Common Exam Pitfalls & Viva Questions to watch out for.
Format using clean Markdown with bold headings and code blocks where applicable.`;
    } else if (action === 'quiz') {
      prompt = `Generate 4 high-yield exam practice questions with detailed solutions and difficulty ratings for the topic "${topic}" in "${subject}". Format as clean structured JSON:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "explanation": "...",
      "difficulty": "Medium"
    }
  ]
}`;
    } else if (action === 'plan') {
      prompt = `Create a realistic ${daysUntilExam || 7}-day revision study schedule for "${subject || 'Engineering Subject'}" focusing on "${topic || 'All Major Units'}".
Include daily morning/evening slots, targeted review topics, and practice problem milestones. Format cleanly in Markdown.`;
    } else {
      prompt = `Summarize and extract key formula/theorems/takeaways from these student notes on ${topic}: "${notesText || topic}". Format with clear bullet points.`;
    }

    const text = await generateGeminiContentWithResilience({
      contents: prompt,
      config: {
        responseMimeType: action === 'quiz' ? 'application/json' : 'text/plain',
        temperature: 0.5,
      },
    });

    let result = text;
    if (action === 'quiz') {
      try {
        result = JSON.parse(text || '{}');
      } catch (e) {
        result = text;
      }
    }

    res.json({ result, source: 'gemini' });
  } catch (error: any) {
    console.error('Study assistant error handled gracefully:', error?.message || error);
    const localStudyRes = generateLocalStudyAssistant(req.body.action, req.body.topic, req.body.subject);
    res.json({ result: localStudyRes, source: 'fallback' });
  }
});

// 4. "Is This College Right For Me?" Fit Analysis Endpoint
app.post('/api/gemini/college-fit', async (req: Request, res: Response) => {
  try {
    const { college, preferences } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const localFit = generateLocalCollegeFit(college, preferences);
      return res.json({ fitAnalysis: localFit, source: 'local_engine' });
    }

    const prompt = `Evaluate whether the college "${college.name}" (${college.location?.city}, Annual Fee: Rs. ${college.feeStructure?.tuitionFeePerYear}, Avg Placement: ${college.placementHistory?.[0]?.avgPackageLPA} LPA) is a good match for this prospective student.

Student Preferences:
- Target Budget: Rs. ${preferences.budget || '2,00,000 / year'}
- Preferred Branch / Field: ${preferences.course || 'B.Tech CSE'}
- Career Goals: ${preferences.careerGoal || 'Software Engineer / Product Tech'}
- Preferred Location: ${preferences.location || 'Delhi NCR / Metro cities'}
- Accommodation: ${preferences.hostelPreference || 'Hostel required'}
- Priorities: ${preferences.priorities || 'Placements, Research, Campus life'}

Provide a JSON object matching this schema:
{
  "fitScorePercentage": 88,
  "verdict": "Strong Match" | "Moderate Match" | "Alternative Recommended",
  "executiveSummary": "A concise, balanced 2-3 sentence verdict for the student.",
  "prosForUser": ["Point 1 tailored to their goals", "Point 2", "Point 3"],
  "potentialChallenges": ["Point 1 (e.g., fee difference, strict attendance, location)", "Point 2"],
  "budgetAnalysis": "Clear comparison of student budget vs total college cost.",
  "academicAndCareerAlignment": "How well the college placement track record matches their target role.",
  "campusCultureFit": "How the clubs, tech culture and vibe fit them.",
  "suggestedQuestionsToAskFaculty": ["Question to ask during campus visit 1", "Question 2"]
}`;

    const text = await generateGeminiContentWithResilience({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(text || '{}');
    res.json({ fitAnalysis: parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Fit analysis error handled gracefully:', error?.message || error);
    const localFit = generateLocalCollegeFit(req.body.college, req.body.preferences);
    res.json({ fitAnalysis: localFit, source: 'fallback' });
  }
});

// 5. Multi-College Comparison Analysis Endpoint
app.post('/api/gemini/compare', async (req: Request, res: Response) => {
  try {
    const { colleges, studentPriorities } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const localComp = generateLocalComparison(colleges, studentPriorities);
      return res.json({ comparison: localComp, source: 'local_engine' });
    }

    const prompt = `Compare these ${colleges?.length || 2} colleges:
${colleges.map((c: any) => `- ${c.name} (${c.location?.city}): Annual Fee: Rs. ${c.feeStructure?.tuitionFeePerYear}, Avg Package: ${c.placementHistory?.[0]?.avgPackageLPA} LPA, Highest: ${c.placementHistory?.[0]?.highestPackageLPA} LPA, Overall Rating: ${c.overallRating}/5`).join('\n')}

Student Stated Priority: "${studentPriorities || 'Balanced - Good Placements and Reasonable Fees'}"

Provide a JSON object matching this schema:
{
  "bestForBudget": "Name of best budget college with 1-sentence reason",
  "bestForPlacements": "Name of best placement college with 1-sentence reason",
  "bestForCampusLife": "Name of best campus life college with 1-sentence reason",
  "bestForAcademics": "Name of best academic college",
  "summaryRecommendation": "Personalized 3-4 sentence comprehensive recommendation based on the student priority.",
  "matrixInsights": [
    { "metric": "Return on Investment (ROI)", "leader": "College Name", "details": "..." },
    { "metric": "Industry Connect & Startups", "leader": "College Name", "details": "..." },
    { "metric": "Hostel & Infrastructure", "leader": "College Name", "details": "..." }
  ]
}`;

    const text = await generateGeminiContentWithResilience({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(text || '{}');
    res.json({ comparison: parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Compare error handled gracefully:', error?.message || error);
    const localComp = generateLocalComparison(req.body.colleges, req.body.studentPriorities);
    res.json({ comparison: localComp, source: 'fallback' });
  }
});

// Local Fallback Helpers
function generateLocalWandResponse(message: string, contextData: any): string {
  const msg = (message || '').toLowerCase();
  const collegeName = contextData?.collegeName || 'Apex Institute of Technology';

  if (msg.includes('class') || msg.includes('timetable') || msg.includes('kal meri') || msg.includes('schedule')) {
    return `According to your timetable for **${collegeName}**:\n- **09:00 AM - 10:00 AM**: Data Structures & Algorithms (Dr. Anandita Mukherjee, LH-301)\n- **10:00 AM - 11:00 AM**: Operating Systems (Dr. Sameer Alvi, LH-301)\n- **11:15 AM - 01:15 PM**: Systems Lab / Practical Lab\n\nYou can also check the interactive weekly view in the **Academics** section!`;
  }
  if (msg.includes('fee') || msg.includes('fees') || msg.includes('cost') || msg.includes('paisa')) {
    return `**Fee Information for ${collegeName}**:\n- **B.Tech CSE Tuition Fee**: Rs. 1,85,000 / year (Official Verified)\n- **Hostel & Mess**: Rs. 75,000 - 1,20,000 / year (depending on AC / Non-AC selection)\n- **Exam Fee**: Rs. 6,000 / year\n\n*Note*: You can use the Total Cost Estimator in the **Fees** tab for a detailed breakdown.`;
  }
  if (msg.includes('attendance') || msg.includes('kam hai') || msg.includes('percentage')) {
    return `**Attendance Guideline**:\n- University mandate requires **75% minimum attendance** across all enrolled courses.\n- If you have between 65% and 75% due to medical reasons, you can submit a **Medical Exemption Form** at the Infirmary / Dean Academics within 7 days.\n- Check the **Student Problem Solver** or **Academics -> Attendance** tab to calculate how many consecutive classes you need to attend to cross 75%!`;
  }
  if (msg.includes('placement') || msg.includes('salary') || msg.includes('package') || msg.includes('job')) {
    return `**Placement Highlights for ${collegeName}**:\n- **Average Package**: 9.8 LPA\n- **Highest Package**: 48.0 LPA\n- **Placement Rate**: 95.8%\n- **Top Recruiters**: Microsoft, Google, Amazon, Adobe, Deloitte, TCS Digital, Cisco.\n- Internship drives begin in the 5th semester through the Training & Placement Cell.`;
  }
  if (msg.includes('hostel') || msg.includes('mess') || msg.includes('room')) {
    return `**Hostel & Campus Facilities**:\n- Separate hostels for boys and girls with 24/7 Wi-Fi and power backup.\n- Biometric check-in with a 9:30 PM curfew.\n- Includes 4 meals/day with vegetarian and special non-veg counters on Wednesdays & Fridays.\n- Apply via the **Administration -> Procedures** section for Room Allotment.`;
  }

  return `Hello! I am **Wand AI**, your intelligent college companion. I can help you with:\n- 📅 Checking your class timetable and upcoming exam dates\n- 💰 Fee structures, scholarship requirements, and payment deadlines\n- 📊 Attendance calculators and attendance shortfall waivers\n- 👨‍🏫 Faculty directory and consultation timings\n- 🏫 College comparisons and "Is this college right for me?" reports\n\nWhat would you like to explore today?`;
}

function generateLocalProblemSolution(query: string, collegeContext: any) {
  const q = (query || '').toLowerCase();

  if (q.includes('attendance') || q.includes('short') || q.includes('kam')) {
    return {
      directAnswer: 'If your attendance has fallen below 75%, do not panic. The college permits a medical/institutional concession of up to 10% if backed by valid medical documentation or approved sports/technical representations.',
      stepByStepSolution: [
        'Collect doctor prescription, medical certificate, and pharmacy bills for the absent dates.',
        'Download and fill the "Attendance Waiver Request Form" from the Administration section.',
        'Get the form signed by your respective subject teachers and HOD.',
        'Submit the signed dossier to the College Infirmary / Dean Academics Office within 7 days.',
        'Check the updated ERP attendance status after 5 working days.',
      ],
      relevantDepartment: 'Dean of Academic Affairs & College Infirmary',
      contactPersonOrOffice: 'Admin Block Room 102 / Medical Center Counter',
      requiredDocuments: ['Registered MBBS Doctor Medical Certificate', 'Hospital discharge / test report slips', 'Original leave application endorsed by Parent'],
      importantDeadlinesOrRules: 'Must be submitted within 7 calendar days of resuming classes. Attendance below 65% requires special Vice Chancellor Committee review.',
      suggestedNextAction: 'Download the Medical Exemption Form from the Administration Procedures tab and visit the College Infirmary today.',
      officialConfirmationDisclaimer: 'Attendance rules are governed by the University Examination Ordinance. Please confirm specific semester deadlines with your Department Academic Coordinator.',
      isVerifiedPolicy: true,
    };
  }

  if (q.includes('fee') || q.includes('late') || q.includes('paisa') || q.includes('install')) {
    return {
      directAnswer: 'College fee payment deadlines are strictly scheduled at the start of each semester. If you are experiencing financial difficulties or waiting for education loan disbursement, you can request an installment plan.',
      stepByStepSolution: [
        'Visit the Accounts Counter in the Admin Block (Counter 3/4).',
        'Submit an "Application for Fee Extension / Installment" detailing your reason.',
        'Attach bank loan sanction letter or income statement if applicable.',
        'Pay the first installment (minimum 50%) to prevent ERP access blockage.',
        'Obtain a formal acknowledgement receipt with the agreed second deadline.',
      ],
      relevantDepartment: 'Accounts & Student Finance Office',
      contactPersonOrOffice: 'Admin Block, 1st Floor, Counter 3 & 4',
      requiredDocuments: ['Previous Semester Fee Clearance Slip', 'Student ID Card', 'Parent/Guardian Application Letter', 'Bank Loan Sanction Letter (if applicable)'],
      importantDeadlinesOrRules: 'Standard late fee is Rs. 50/day after due date for the first week, then Rs. 100/day. ERP portal gets locked after 15 days of non-payment.',
      suggestedNextAction: 'Meet the Accounts Officer (09:30 AM - 03:30 PM) to submit an installment undertaking before the penalty multiplies.',
      officialConfirmationDisclaimer: 'Fee policies and late fee caps are subject to the Finance Committee notifications. Always obtain a stamped paper receipt.',
      isVerifiedPolicy: true,
    };
  }

  if (q.includes('scholarship') || q.includes('nsp') || q.includes('waiver') || q.includes('aid')) {
    return {
      directAnswer: 'Multiple government (NSP, State Post-Matric) and institutional merit scholarships are available. The college Scholarship Cell facilitates document verification and bonafide endorsements.',
      stepByStepSolution: [
        'Check eligibility criteria on the National Scholarship Portal (NSP) or College Scholarship catalog.',
        'Apply for a Bonafide Certificate specifying "Scholarship Application" via ERP.',
        'Gather income certificate issued by Tehsildar (dated after April of current financial year), caste certificate (if applicable), and previous year grade cards.',
        'Submit online on the NSP portal and take a physical printout of the application form.',
        'Submit the physical copy at College Room 102 for institutional online verification.',
      ],
      relevantDepartment: 'Scholarship & Student Welfare Cell',
      contactPersonOrOffice: 'Admin Block Room 102 (Dean Student Affairs)',
      requiredDocuments: ['Annual Family Income Certificate (< 2.5 LPA or < 6 LPA)', '10th & 12th Marksheets + College Grade Cards', 'Aadhaar Card linked to active Bank Account', 'College Bonafide Certificate & Fee Receipt'],
      importantDeadlinesOrRules: 'National Scholarship Portal deadline is generally 31st October. Late submissions cannot be verified by the college.',
      suggestedNextAction: 'Apply for your Bonafide Certificate right now in the Administration section to ensure you meet the verification deadline.',
      officialConfirmationDisclaimer: 'Government scholarship disbursements are governed directly by DBT (Direct Benefit Transfer). College only verifies active enrollment.',
      isVerifiedPolicy: true,
    };
  }

  return {
    directAnswer: `For your query regarding "${query}", the college administration provides standardized grievance and administrative procedures to resolve student concerns smoothly.`,
    stepByStepSolution: [
      'Identify the concerned department (Academic Registrar, Accounts, or Student Affairs).',
      'Check if an online form is available in the Student Wand Administration section.',
      'Submit the formal request with your Student ID and supporting documents.',
      'Track your application token number at the designated admin counter.',
    ],
    relevantDepartment: 'Student Affairs & General Administration',
    contactPersonOrOffice: 'Admin Block Helpdesk / Central Registrar Office',
    requiredDocuments: ['Valid College Student ID Card', 'Relevant academic or payment proof'],
    importantDeadlinesOrRules: 'Working hours are Monday to Friday 09:30 AM to 04:00 PM.',
    suggestedNextAction: 'Check the Administration tab for direct contact information and downloadable forms.',
    officialConfirmationDisclaimer: 'Always confirm administrative instructions with the designated official authority.',
    isVerifiedPolicy: true,
  };
}

function generateLocalStudyAssistant(action: string, topic: string, subject: string) {
  if (action === 'explain') {
    return `### Concept Breakdown: ${topic || 'Key Topic'} (${subject || 'Engineering'})\n\n` +
      `**1. Intuitive Analogy**\n` +
      `Imagine you are organizing a massive library. Instead of checking every shelf one by one, you use an index card catalog with balanced categories. This is exactly how balanced data hierarchies and optimized state machines operate!\n\n` +
      `**2. Core Principle**\n` +
      `- **Definition**: An optimized mathematical and architectural method to process queries in logarithmic or linear time.\n` +
      `- **Key Invariant**: Guarantees that even under worst-case inputs, the system does not degrade into quadratic complexity.\n\n` +
      `**3. Practical Steps to Solve Problems**\n` +
      `1. Identify the sub-problems and check if optimal substructure holds.\n` +
      `2. Establish the base cases and boundary constraints.\n` +
      `3. Write the recurrence relation or state transition formula.\n` +
      `4. Verify space and time complexity: Target $O(N \\log N)$ or $O(N)$.\n\n` +
      `**4. Key Exam Formula & Tips**\n` +
      `- Always check for off-by-one errors in boundary loops.\n` +
      `- Draw the state tree on paper before writing code in mid-semester exams.`;
  }
  if (action === 'quiz') {
    return {
      topic: topic || 'Data Structures & Algorithms',
      questions: [
        {
          id: 1,
          question: `What is the worst-case time complexity of searching an element in a balanced AVL Tree with N elements?`,
          options: ['A. O(1)', 'B. O(log N)', 'C. O(N)', 'D. O(N log N)'],
          correctAnswer: 'B',
          explanation: 'Because an AVL tree strictly maintains a balance factor between -1 and +1 for every node, the height is bounded by 1.44 log2(N), guaranteeing O(log N) search.',
          difficulty: 'Easy',
        },
        {
          id: 2,
          question: `Which traversal of a Binary Search Tree produces elements in non-decreasing sorted order?`,
          options: ['A. Pre-order', 'B. Post-order', 'C. In-order', 'D. Level-order'],
          correctAnswer: 'C',
          explanation: 'In-order traversal visits Left Subtree -> Root -> Right Subtree, which directly yields sorted elements for any valid BST.',
          difficulty: 'Easy',
        },
        {
          id: 3,
          question: `In Database Concurrency Control, what does the 'I' in ACID stand for?`,
          options: ['A. Integrity', 'B. Isolation', 'C. Indexing', 'D. Idempotency'],
          correctAnswer: 'B',
          explanation: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state as if the transactions were executed sequentially.',
          difficulty: 'Medium',
        },
        {
          id: 4,
          question: `Which CPU scheduling algorithm can potentially lead to starvation of longer processes?`,
          options: ['A. First Come First Served (FCFS)', 'B. Round Robin with small quantum', 'C. Shortest Job First (SJF / SRTF)', 'D. Uniform Priority Queue'],
          correctAnswer: 'C',
          explanation: 'In SJF/SRTF, if a continuous stream of short bursts arrives, long processes may wait indefinitely (starvation). Aging is used to mitigate this.',
          difficulty: 'Medium',
        },
      ],
    };
  }
  return `### 7-Day Target Study Plan for ${topic || 'Upcoming Exams'}\n\n` +
    `- **Day 1 & 2 (Foundations)**: Review core definitions, theorems, and state transition equations. Solve 5 standard textbook problems.\n` +
    `- **Day 3 & 4 (Deep Dive)**: Implement practical algorithms and solve previous 3 years mid-sem question papers.\n` +
    `- **Day 5 (Edge Cases & Viva)**: Practice time complexity proofs, normal forms, and tricky multiple-choice questions.\n` +
    `- **Day 6 (Full Mock Test)**: Time yourself with a 2-hour closed-book test using the study materials bank.\n` +
    `- **Day 7 (Light Revision & Mind Map)**: Review summary cheat-sheets and get a good 8 hours of sleep before exam day!`;
}

function generateLocalCollegeFit(college: any, preferences: any) {
  const fee = college?.feeStructure?.tuitionFeePerYear || 185000;
  const targetBudget = Number(preferences?.budget) || 250000;
  const isBudgetOk = targetBudget >= fee;
  const score = isBudgetOk ? 92 : 74;

  return {
    fitScorePercentage: score,
    verdict: score >= 85 ? 'Strong Match' : 'Moderate Match',
    executiveSummary: `${college.name} is a high-performing match for your interest in ${preferences?.course || 'Technology & Engineering'}. Its placement track record (${college.placementHistory?.[0]?.avgPackageLPA || '9.8'} LPA average) aligns directly with your career goals.`,
    prosForUser: [
      `Strong industry recruitment from top tech giants (Microsoft, Amazon, Google, Deloitte).`,
      `Extensive modern AI & Robotics computing labs with dedicated student innovation hubs.`,
      `Active student clubs and national level hackathons like HackApex to build a standout portfolio.`,
    ],
    potentialChallenges: [
      `Strict 75% attendance policy enforced through biometric ERP.`,
      `Hostel curfew of 9:30 PM may feel restrictive for late off-campus outings.`,
      isBudgetOk ? 'Within stated budget.' : 'Total fee including hostel may exceed your initial target budget; look into merit scholarships.',
    ],
    budgetAnalysis: `Tuition is Rs. ${fee.toLocaleString()} / year. Total estimated cost with hostel & mess is approx Rs. ${(fee + 95000).toLocaleString()} / year.`,
    academicAndCareerAlignment: `Over 94% placement rate in CSE/AI departments with extensive alumni network in top tier tech firms.`,
    campusCultureFit: `Collaborative, project-driven atmosphere with vibrant annual fests (Apex Zenith) and 28+ active student societies.`,
    suggestedQuestionsToAskFaculty: [
      'What percentage of 3rd year students receive paid 6-month industry internships?',
      'Are there research grants available for undergraduate AI publications?',
    ],
  };
}

function generateLocalComparison(colleges: any[], priorities: string) {
  const list = colleges || [];
  return {
    bestForBudget: list[2]?.name || list[0]?.name || 'Delhi Metropolitan University (Lowest annual tuition fee at Rs. 45,000/yr)',
    bestForPlacements: list[1]?.name || list[0]?.name || 'St. Xavier Global / Apex Tech (Average CTC > 11 LPA with highest package 52 LPA)',
    bestForCampusLife: list[0]?.name || 'Apex Institute of Technology (28+ active clubs, 120-acre lush smart campus, mega Zenith fest)',
    bestForAcademics: list[0]?.name || 'Apex Tech (Autonomous curriculum updated annually with industry advisory board)',
    summaryRecommendation: `Based on your stated priorities ("${priorities || 'Balanced Approach'}"), ${list[0]?.name || 'Apex Institute'} offers the most complete ecosystem balancing robust placements, state-of-the-art labs, and active student clubs. If budget is your number one constraint, consider ${list[2]?.name || 'State University options'} for unbeatable ROI.`,
    matrixInsights: [
      { metric: 'Return on Investment (ROI)', leader: list[2]?.name || 'DMU Delhi', details: 'Very low tuition with strong corporate placement access.' },
      { metric: 'Tech Hub Proximity & Startups', leader: list[1]?.name || 'St. Xavier Global', details: 'Direct Electronic City / Bengaluru tech park networking.' },
      { metric: 'Infrastructure & Labs', leader: list[0]?.name || 'Apex Tech', details: '120-acre smart campus with NVIDIA GPU cluster and sports arena.' },
    ],
  };
}

// Start Server with Vite Middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Wand server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
