import React, { useState, useMemo } from 'react';
import {
  Users,
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Plus,
  Send,
  HelpCircle,
  BookOpen,
  Building2,
  GraduationCap,
  Award,
  ArrowRight,
  Filter,
  Share2,
  Star,
  MapPin,
  Clock,
  Briefcase,
  X,
  UserCheck,
} from 'lucide-react';
import {
  AlumniMentor,
  SeniorDiscussionPost,
  SeniorDiscussionReply,
  StudentProfile,
  College,
} from '../types';
import {
  MOCK_ALUMNI_MENTORS,
  MOCK_SENIOR_DISCUSSIONS,
} from '../data/seniorsAndInternshipsData';

interface SeniorsAlumniHubProps {
  studentProfile: StudentProfile;
  activeCollege?: College;
  onOpenWandAIWithPrompt: (prompt: string) => void;
}

export const SeniorsAlumniHub: React.FC<SeniorsAlumniHubProps> = ({
  studentProfile,
  activeCollege,
  onOpenWandAIWithPrompt,
}) => {
  // Navigation sub-view: 'discussions' | 'mentors' | 'playbooks'
  const [activeSubTab, setActiveSubTab] = useState<'discussions' | 'mentors' | 'playbooks'>('discussions');

  // Discussion state
  const [posts, setPosts] = useState<SeniorDiscussionPost[]>(MOCK_SENIOR_DISCUSSIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [discussionSearch, setDiscussionSearch] = useState<string>('');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState<string>('All');
  const [activePostDetails, setActivePostDetails] = useState<SeniorDiscussionPost | null>(null);

  // New Discussion Modal
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<SeniorDiscussionPost['category']>('Placement & SDE');
  const [newTagsInput, setNewTagsInput] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Active Reply input inside expanded post modal or inline
  const [replyText, setReplyText] = useState<string>('');

  // Mentors state
  const [mentorsList] = useState<AlumniMentor[]>(MOCK_ALUMNI_MENTORS);
  const [mentorSearch, setMentorSearch] = useState<string>('');
  const [mentorDomainFilter, setMentorDomainFilter] = useState<string>('All');
  const [mentorCollegeFilter, setMentorCollegeFilter] = useState<string>('All');
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<AlumniMentor | null>(null);
  const [bookingTopic, setBookingTopic] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('Tomorrow, 6:00 PM');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<boolean>(false);

  // Filtered discussions
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory !== 'All' && post.category !== selectedCategory) {
        return false;
      }
      // College filter
      if (selectedCollegeFilter !== 'All') {
        if (selectedCollegeFilter === 'My College' && studentProfile.collegeId) {
          if (post.collegeId && post.collegeId !== studentProfile.collegeId) return false;
        } else if (selectedCollegeFilter === 'Kanpur Colleges') {
          if (!post.collegeId?.includes('kanpur') && !post.collegeName?.toLowerCase().includes('kanpur')) {
            return false;
          }
        }
      }
      // Text search
      if (discussionSearch.trim()) {
        const q = discussionSearch.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesContent = post.content.toLowerCase().includes(q);
        const matchesAuthor = post.authorName.toLowerCase().includes(q);
        const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesTags) return false;
      }
      return true;
    });
  }, [posts, selectedCategory, selectedCollegeFilter, discussionSearch, studentProfile.collegeId]);

  // Filtered mentors
  const filteredMentors = useMemo(() => {
    return mentorsList.filter((mentor) => {
      // Domain filter
      if (mentorDomainFilter !== 'All') {
        const lowerDomain = mentorDomainFilter.toLowerCase();
        const matchesRole = mentor.currentRole.toLowerCase().includes(lowerDomain);
        const matchesCompany = mentor.currentCompany.toLowerCase().includes(lowerDomain);
        const matchesExpertise = mentor.expertiseTags.some((tag) => tag.toLowerCase().includes(lowerDomain));
        if (!matchesRole && !matchesCompany && !matchesExpertise) return false;
      }
      // College filter
      if (mentorCollegeFilter !== 'All') {
        if (mentorCollegeFilter === 'My College' && studentProfile.collegeId) {
          if (mentor.collegeId !== studentProfile.collegeId) return false;
        } else if (mentorCollegeFilter === 'Kanpur Region') {
          if (!mentor.collegeId.includes('kanpur')) return false;
        }
      }
      // Search
      if (mentorSearch.trim()) {
        const q = mentorSearch.toLowerCase();
        const matchesName = mentor.name.toLowerCase().includes(q);
        const matchesCompany = mentor.currentCompany.toLowerCase().includes(q);
        const matchesRole = mentor.currentRole.toLowerCase().includes(q);
        const matchesCollege = mentor.collegeName.toLowerCase().includes(q);
        const matchesTags = mentor.expertiseTags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesName && !matchesCompany && !matchesRole && !matchesCollege && !matchesTags) return false;
      }
      return true;
    });
  }, [mentorsList, mentorDomainFilter, mentorCollegeFilter, mentorSearch, studentProfile.collegeId]);

  // Handle Post Upvote
  const handleToggleUpvote = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isUpvoted = p.userUpvoted;
          return {
            ...p,
            userUpvoted: !isUpvoted,
            upvotes: isUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          };
        }
        return p;
      })
    );
  };

  // Handle Adding New Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const parsedTags = newTagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPostItem: SeniorDiscussionPost = {
      id: `disc-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      collegeId: studentProfile.collegeId || 'clg-kanpur-iitk',
      collegeName: studentProfile.collegeName || 'My College',
      authorName: isAnonymous ? 'Curious Student (Anonymous)' : studentProfile.name || 'Current Student',
      authorRole: isAnonymous ? 'Student' : `${studentProfile.branch || 'B.Tech'} • Year ${studentProfile.year || 3}`,
      authorYearOrBatch: `Class of ${2024 + (4 - (studentProfile.year || 3))}`,
      isVerified: !isAnonymous,
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      tags: parsedTags.length > 0 ? parsedTags : ['StudentGuidance', 'Advice'],
      replies: [],
      viewsCount: 1,
    };

    setPosts([newPostItem, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewTagsInput('');
    setIsAskModalOpen(false);
  };

  // Handle Adding Reply
  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    const newReply: SeniorDiscussionReply = {
      id: `rep-${Date.now()}`,
      authorName: studentProfile.name || 'You',
      authorRole: 'Student',
      authorCollege: studentProfile.collegeName || 'Student Wand Member',
      authorBatch: `Year ${studentProfile.year || 3}`,
      isVerified: true,
      content: replyText.trim(),
      createdAt: 'Just now',
      upvotes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [...p.replies, newReply],
          };
        }
        return p;
      })
    );

    if (activePostDetails && activePostDetails.id === postId) {
      setActivePostDetails({
        ...activePostDetails,
        replies: [...activePostDetails.replies, newReply],
      });
    }

    setReplyText('');
  };

  // Categories list
  const categoriesList = [
    'All',
    'Placement & SDE',
    'Core Engineering',
    'GATE & Higher Studies',
    'Off-Campus & Referrals',
    'College Exams & Professors',
    'Internship Advice',
    'General Guidance',
  ];

  return (
    <div id="seniors-alumni-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#2D2A4A] via-[#23203c] to-[#1a182e] text-white p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Senior Mentorship & Verified Alumni Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit']">
            Connect with Seniors & Alumni
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Get unfiltered placement roadmaps, GATE tips, off-campus referral guidance, and 1-on-1 mentorship from alumni working at Google, Microsoft, BHEL, TCS, Zomato, and leading institutions.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#2D2A4A] font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ask a Senior / Post Query</span>
            </button>
            <button
              onClick={() => {
                onOpenWandAIWithPrompt(
                  `Help me draft a personalized cold message/email on LinkedIn to an alumnus from ${studentProfile.collegeName || 'my college'} asking for SDE/Core guidance and referral.`
                );
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Alumni Outreach Generator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('discussions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'discussions'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Senior Q&A & Discussions</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-bold">
              {posts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('mentors')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'mentors'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Verified Alumni Directory & 1:1 Booking</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-bold">
              {mentorsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('playbooks')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'playbooks'
                ? 'bg-[#2D2A4A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Career Playbooks & Roadmaps</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DISCUSSIONS & Q&A */}
      {activeSubTab === 'discussions' && (
        <div className="space-y-6">
          {/* Filter and Search Toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={discussionSearch}
                  onChange={(e) => setDiscussionSearch(e.target.value)}
                  placeholder="Search questions by topic, company, college, or tags (e.g. LeetCode, GATE, AKTU, Referrals)..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCollegeFilter}
                  onChange={(e) => setSelectedCollegeFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Institutions</option>
                  <option value="Kanpur Colleges">🏛️ Kanpur Region (IITK, HBTU, CSJMU, Axis...)</option>
                  <option value="My College">🎓 My Enrolled College</option>
                </select>

                <button
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#2D2A4A] text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ask Question</span>
                </button>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-800">No discussions match your filter</div>
                <p className="text-xs text-slate-500">
                  Be the first to start a conversation or ask your college seniors a question!
                </p>
                <button
                  onClick={() => setIsAskModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ask This Question</span>
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isExpanded = activePostDetails?.id === post.id;
                return (
                  <div
                    key={post.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                            {post.category}
                          </span>
                          {post.collegeName && (
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              <span>{post.collegeName}</span>
                            </span>
                          )}
                          {post.isSolved && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Answered by Senior</span>
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => setActivePostDetails(isExpanded ? null : post)}
                          className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
                        >
                          {post.title}
                        </h3>
                      </div>

                      {/* Upvote Button */}
                      <button
                        onClick={(e) => handleToggleUpvote(post.id, e)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                          post.userUpvoted
                            ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Upvote this helpful query"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs font-extrabold mt-0.5">{post.upvotes}</span>
                      </button>
                    </div>

                    {/* Content Preview */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author & Footer Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {post.authorName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800">{post.authorName}</span>
                        <span>•</span>
                        <span className="text-slate-500">{post.authorRole}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setActivePostDetails(isExpanded ? null : post)}
                          className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.replies.length} Replies</span>
                        </button>
                        <button
                          onClick={() => {
                            onOpenWandAIWithPrompt(
                              `Provide an in-depth, structured senior advice answer to this college query: "${post.title}". Context: ${post.content}`
                            );
                          }}
                          className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold cursor-pointer bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>AI Senior Answer</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Replies Thread */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 bg-slate-50/70 p-4 rounded-xl">
                        <div className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>Replies & Advice from Seniors ({post.replies.length})</span>
                        </div>

                        {post.replies.length === 0 ? (
                          <div className="text-xs text-slate-500 py-2">
                            No answers posted yet. Be the first senior or peer to contribute!
                          </div>
                        ) : (
                          post.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                                reply.isAcceptedSolution
                                  ? 'bg-emerald-50/60 border-emerald-300'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900">{reply.authorName}</span>
                                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    {reply.authorRole}
                                  </span>
                                  {reply.authorCollege && (
                                    <span className="text-slate-500 text-[11px]">• {reply.authorCollege}</span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                              </div>

                              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                                {reply.content}
                              </p>

                              {reply.isAcceptedSolution && (
                                <div className="text-[10px] font-bold text-emerald-800 flex items-center gap-1 pt-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Top Recommended Answer by Alumni</span>
                                </div>
                              )}
                            </div>
                          ))
                        )}

                        {/* Reply Form */}
                        <div className="pt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddReply(post.id);
                            }}
                            placeholder="Share your experience or advice on this topic..."
                            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleAddReply(post.id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 rounded-xl bg-[#2D2A4A] text-white hover:bg-slate-800 disabled:opacity-50 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ALUMNI MENTORS DIRECTORY */}
      {activeSubTab === 'mentors' && (
        <div className="space-y-6">
          {/* Mentors Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  placeholder="Search alumni by name, company (Google, Microsoft, Zomato, BHEL), skill, or college..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={mentorDomainFilter}
                  onChange={(e) => setMentorDomainFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
                >
                  <option value="All">All Domains</option>
                  <option value="Software">Software & Tech</option>
                  <option value="Product">Product Management</option>
                  <option value="Data">Data Science & AI</option>
                  <option value="Core">Core / Mechanical / PSU</option>
                  <option value="Audit">Finance & Consulting</option>
                  <option value="Cloud">Cloud & DevOps</option>
                </select>

                <select
                  value={mentorCollegeFilter}
                  onChange={(e) => setMentorCollegeFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
                >
                  <option value="All">All Colleges</option>
                  <option value="Kanpur Region">🏛️ Kanpur Region (IITK, HBTU, CSJMU, Axis...)</option>
                  <option value="My College">🎓 My Enrolled College</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-base flex items-center justify-center shadow-xs shrink-0">
                        {mentor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-slate-900 text-base">{mentor.name}</h3>
                          {mentor.isVerifiedAlumnus && (
                            <span title="Verified Alumnus">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          <span>{mentor.currentRole}</span>
                          <span className="text-indigo-600 font-bold">@ {mentor.currentCompany}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{mentor.rating}</span>
                    </div>
                  </div>

                  {/* College & Degree */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{mentor.collegeName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {mentor.degree} in {mentor.branch} • <strong className="text-slate-700">Class of {mentor.gradYear}</strong>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {mentor.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertiseTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span><strong>{mentor.totalMenteesHelped}</strong> juniors guided</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onOpenWandAIWithPrompt(
                          `I want to prepare questions for a mentorship call with ${mentor.name} (${mentor.currentRole} at ${mentor.currentCompany}, alumnus of ${mentor.collegeName}). Suggest 5 high-impact questions regarding ${mentor.expertiseTags.join(', ')}.`
                        );
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      title="Prepare questions with Wand AI"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedMentorForBooking(mentor);
                        setBookingTopic(mentor.mentorshipTopics[0] || 'Placement Roadmap');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2D2A4A] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      <span>Request 1:1 Session</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CAREER PLAYBOOKS & ROADMAPS */}
      {activeSubTab === 'playbooks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Playbook 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  💻
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  The Tier-2/3 Off-Campus SDE Playbook
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Written by alumni from Axis Colleges & HBTU who landed ₹18+ LPA product roles. Covers DSA patterns, cold emailing templates that get 40% reply rate, and project README blueprints.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">12 Modules</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">DSA + Projects</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenWandAIWithPrompt(
                    `Give me the full step-by-step roadmap from "The Tier-2/3 Off-Campus SDE Playbook" tailored for a ${studentProfile.course || 'B.Tech'} student in ${studentProfile.year || 3}rd year targeting product companies.`
                  );
                }}
                className="w-full mt-3 py-2 rounded-xl bg-[#2D2A4A] text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Read Full Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playbook 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
                  ⚙️
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  GATE & PSU Cracking Strategy alongside College
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Authored by IIT Kanpur & BHEL alumni (AIR 42). Subject-by-subject weightage mapping between university exams (AKTU/CSJMU) and GATE 2025/2026 test series scheduling.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800">Formula Sheets</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">PSU Mock HR</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenWandAIWithPrompt(
                    `Provide the complete GATE preparation schedule and book list for ${studentProfile.branch || 'Mechanical Engineering / CSE'} alongside university semester syllabus.`
                  );
                }}
                className="w-full mt-3 py-2 rounded-xl bg-[#2D2A4A] text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Read Full Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playbook 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
                  📈
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Mandatory Summer Training & Internship Blueprint
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete guide on getting university NOC, finding AICTE approved 6-week summer internships, maintaining the faculty logbook, and converting internships into PPOs.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800">AICTE Approved</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Logbook Template</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenWandAIWithPrompt(
                    `Explain how to fulfill the mandatory AICTE/AKTU 6-week summer internship requirement, including NOC application format, weekly logbook, and project synopsis.`
                  );
                }}
                className="w-full mt-3 py-2 rounded-xl bg-[#2D2A4A] text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Read Full Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASK A SENIOR / NEW QUERY */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center">
                  ✨
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Ask Seniors & Alumni</h3>
                  <p className="text-xs text-slate-500">Post your question to college seniors and verified alumni</p>
                </div>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to prepare for TCS Digital vs Amazon SDE alongside 6th sem exams?"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Topic Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Placement & SDE">Placement & SDE</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="GATE & Higher Studies">GATE & Higher Studies</option>
                    <option value="Off-Campus & Referrals">Off-Campus & Referrals</option>
                    <option value="College Exams & Professors">College Exams & Professors</option>
                    <option value="Internship Advice">Internship Advice</option>
                    <option value="General Guidance">General Guidance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTagsInput}
                    onChange={(e) => setNewTagsInput(e.target.value)}
                    placeholder="LeetCode, AKTU, Interview, Resume"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Context & Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Explain your current branch, semester, what you have tried so far, and the specific guidance you need..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-0"
                  />
                  <span>Post Anonymously (Hide your name)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Question</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BOOK 1:1 MENTORSHIP SESSION */}
      {selectedMentorForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
                  {selectedMentorForBooking.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Request 1:1 with {selectedMentorForBooking.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedMentorForBooking.currentRole} at {selectedMentorForBooking.currentCompany}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMentorForBooking(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Mentorship Topic *</label>
                <select
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                >
                  {selectedMentorForBooking.mentorshipTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                  <option value="General Career Guidance & Resume Review">General Career Guidance & Resume Review</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Time Slot *</label>
                <select
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="Tomorrow, 6:00 PM">Tomorrow, 6:00 PM (Google Meet)</option>
                  <option value="Saturday, 11:00 AM">Saturday, 11:00 AM (Google Meet)</option>
                  <option value="Sunday, 4:00 PM">Sunday, 4:00 PM (Google Meet)</option>
                  <option value="Asynchronous (In-App Q&A Chat)">Asynchronous (In-App Q&A Chat)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  This session is 100% free under the Student Wand Alumni Guidance Initiative. The mentor will receive your student profile and resume link.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedMentorForBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedMentorForBooking(null);
                  setBookingSuccessModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Confirm Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING SUCCESS CONFIRMATION MODAL */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Mentorship Request Sent!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your request for <strong className="text-slate-800">{bookingTopic}</strong> has been shared with the alumnus. You will receive an invitation link on your registered email.
            </p>
            <button
              onClick={() => setBookingSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#2D2A4A] text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
