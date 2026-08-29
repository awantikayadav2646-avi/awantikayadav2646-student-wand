import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { CollegeExplorer } from './components/CollegeExplorer';
import { CampusLife } from './components/CampusLife';
import { FacultyDirectory } from './components/FacultyDirectory';
import { Academics } from './components/Academics';
import { FeesAndScholarships } from './components/FeesAndScholarships';
import { Administration } from './components/Administration';
import { ProblemSolver } from './components/ProblemSolver';
import { CollegeCompare } from './components/CollegeCompare';
import { CommunityReviews } from './components/CommunityReviews';
import { NotificationDrawer } from './components/NotificationDrawer';
import { WandAIModal } from './components/WandAIModal';
import { ProfileModal } from './components/ProfileModal';
import { AdminPanel } from './components/AdminPanel';
import { OnboardingScreen } from './components/OnboardingScreen';
import { SeniorsAlumniHub } from './components/SeniorsAlumniHub';
import { InternshipsTrainingHub } from './components/InternshipsTrainingHub';
import { SafeCampusHub } from './components/SafeCampusHub';

import {
  MOCK_COLLEGES,
  MOCK_FACULTY,
  MOCK_TIMETABLE,
  MOCK_ATTENDANCE,
  MOCK_ASSIGNMENTS,
  MOCK_STUDY_MATERIALS,
  MOCK_EXAMS,
  MOCK_NOTICES,
  MOCK_EVENTS,
  MOCK_REVIEWS,
  DEFAULT_STUDENT_PROFILE,
} from './data/mockData';

import {
  UserRole,
  StudentProfile,
  College,
  NoticeItem,
  EventItem,
  CollegeReview,
  OnboardingData,
  SupportedLanguage,
} from './types';

export default function App() {
  // Navigation & Role States
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('current_student');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('studentwand_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_STUDENT_PROFILE;
      }
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  // Onboarding full-screen display state: automatically show on first launch if not completed
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    const isCompleted = localStorage.getItem('studentwand_onboarding_completed');
    const profileSaved = localStorage.getItem('studentwand_profile');
    if (isCompleted === 'true' || (profileSaved && JSON.parse(profileSaved)?.onboardingCompleted)) {
      return false;
    }
    return true;
  });

  // Dynamic Data States (can be mutated in-session)
  const [colleges, setColleges] = useState<College[]>(MOCK_COLLEGES);
  const [notices, setNotices] = useState<NoticeItem[]>(MOCK_NOTICES);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [reviews, setReviews] = useState<CollegeReview[]>(MOCK_REVIEWS);

  // Modals & Drawers
  const [isWandAIOpen, setIsWandAIOpen] = useState(false);
  const [wandAIPrompt, setWandAIPrompt] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Active college reference
  const activeCollege =
    colleges.find((c) => c.id === studentProfile.collegeId) || colleges[0];

  // Save profile changes to local storage
  const handleSaveProfile = (updated: StudentProfile) => {
    setStudentProfile(updated);
    localStorage.setItem('studentwand_profile', JSON.stringify(updated));
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    const updated: StudentProfile = {
      ...studentProfile,
      language: lang,
    };
    handleSaveProfile(updated);
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    const mappedRole: UserRole =
      data.studentStatus === 'prospective_student' ? 'prospective_student' : 'current_student';

    const updatedProfile: StudentProfile = {
      ...studentProfile,
      collegeId: data.collegeId || studentProfile.collegeId || 'iit-delhi',
      collegeName: data.collegeName || studentProfile.collegeName,
      department: data.branch || studentProfile.department,
      branch: data.branch || studentProfile.branch,
      course: data.course || studentProfile.course,
      year: data.year ? parseInt(data.year, 10) || studentProfile.year : studentProfile.year,
      semester:
        typeof data.semester === 'number'
          ? data.semester
          : data.semester
          ? parseInt(data.semester, 10) || studentProfile.semester
          : studentProfile.semester,
      state: data.state || studentProfile.state,
      country: data.country || 'India',
      city: data.city || studentProfile.city,
      language: data.language || studentProfile.language || 'en',
      role: mappedRole,
      onboardingCompleted: true,
      interestedColleges: data.interestedColleges,
      isCustomCollege: data.isCustomCollege,
      customCollegeUniversity: data.customCollegeUniversity,
      customCollegeWebsite: data.customCollegeWebsite,
      verificationStatus: data.verificationStatus,
    };

    setStudentProfile(updatedProfile);
    setUserRole(mappedRole);
    localStorage.setItem('studentwand_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('studentwand_onboarding_completed', 'true');
    setShowOnboarding(false);

    // If prospective, take to college explorer; otherwise take directly to personalized dashboard
    if (data.studentStatus === 'prospective_student') {
      setCurrentTab('explorer');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleOpenWandAIWithPrompt = (prompt: string) => {
    setWandAIPrompt(prompt);
    setIsWandAIOpen(true);
  };

  const handleAddNotice = (newNotice: NoticeItem) => {
    setNotices([newNotice, ...notices]);
  };

  const handleAddEvent = (newEvent: EventItem) => {
    setEvents([newEvent, ...events]);
  };

  const handleAddReview = (newReview: CollegeReview) => {
    setReviews([newReview, ...reviews]);
  };

  // If first time onboarding is active, display the full onboarding window
  if (showOnboarding) {
    return (
      <OnboardingScreen
        initialProfile={studentProfile}
        onComplete={handleOnboardingComplete}
        onSkip={() => {
          localStorage.setItem('studentwand_onboarding_completed', 'true');
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        studentProfile={studentProfile}
        unreadNoticesCount={notices.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenWandAI={() => {
          setWandAIPrompt('');
          setIsWandAIOpen(true);
        }}
        onOpenAuth={() => setIsProfileOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onChangeLanguage={handleLanguageChange}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-20 xl:pb-10">
        {currentTab === 'home' && (
          <LandingPage
            onExploreColleges={() => setCurrentTab('explorer')}
            onGetStarted={() => {
              if (userRole === 'prospective_student') {
                setCurrentTab('explorer');
              } else {
                setCurrentTab('dashboard');
              }
            }}
            onAskWandAI={() => {
              setWandAIPrompt('');
              setIsWandAIOpen(true);
            }}
            onSelectFeatureTab={(tab) => setCurrentTab(tab)}
            userRole={userRole}
            setUserRole={setUserRole}
          />
        )}

        {currentTab === 'dashboard' && (
          <StudentDashboard
            studentProfile={studentProfile}
            activeCollege={activeCollege}
            timetable={MOCK_TIMETABLE}
            attendance={MOCK_ATTENDANCE}
            assignments={MOCK_ASSIGNMENTS}
            exams={MOCK_EXAMS}
            notices={notices}
            events={events}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'explorer' && (
          <CollegeExplorer
            colleges={colleges}
            onCompareCollege={(clg) => {
              setCurrentTab('compare');
            }}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'campus' && (
          <CampusLife
            college={activeCollege}
            events={events}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'faculty' && (
          <FacultyDirectory
            facultyList={MOCK_FACULTY}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'academics' && (
          <Academics
            timetable={MOCK_TIMETABLE}
            attendance={MOCK_ATTENDANCE}
            assignments={MOCK_ASSIGNMENTS}
            materials={MOCK_STUDY_MATERIALS}
            exams={MOCK_EXAMS}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'fees' && (
          <FeesAndScholarships
            college={activeCollege}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'admin' && (
          <Administration
            college={activeCollege}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'problems' && (
          <ProblemSolver
            college={activeCollege}
            studentProfile={studentProfile}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'compare' && (
          <CollegeCompare
            colleges={colleges}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'alumni' && (
          <SeniorsAlumniHub
            studentProfile={studentProfile}
            activeCollege={activeCollege}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'internships' && (
          <InternshipsTrainingHub
            studentProfile={studentProfile}
            activeCollege={activeCollege}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'safe-campus' && (
          <SafeCampusHub
            studentProfile={studentProfile}
            activeCollege={activeCollege}
            onOpenWandAIWithPrompt={handleOpenWandAIWithPrompt}
          />
        )}

        {currentTab === 'community' && (
          <CommunityReviews
            reviews={reviews}
            studentProfile={studentProfile}
            onAddReview={handleAddReview}
          />
        )}

        {currentTab === 'admin-portal' && (
          <AdminPanel
            college={activeCollege}
            notices={notices}
            faculty={MOCK_FACULTY}
            events={events}
            onAddNotice={handleAddNotice}
            onAddEvent={handleAddEvent}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        onOpenWandAI={() => {
          setWandAIPrompt('');
          setIsWandAIOpen(true);
        }}
        onOpenMore={() => setIsProfileOpen(true)}
      />

      {/* Conversational Wand AI Assistant Popup */}
      <WandAIModal
        isOpen={isWandAIOpen}
        onClose={() => setIsWandAIOpen(false)}
        college={activeCollege}
        studentProfile={studentProfile}
        initialPrompt={wandAIPrompt}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notices={notices}
        onMarkAllRead={() => {
          setNotices([]);
          setIsNotificationsOpen(false);
        }}
      />

      {/* Student Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        studentProfile={studentProfile}
        onSaveProfile={handleSaveProfile}
        userRole={userRole}
        setUserRole={setUserRole}
        colleges={colleges}
        onReRunOnboarding={() => setShowOnboarding(true)}
      />
    </div>
  );
}
