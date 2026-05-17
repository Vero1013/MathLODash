/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  ArrowLeft,
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trophy, 
  GraduationCap,
  LayoutGrid,
  List as ListIcon,
  X,
  FileText,
  PlayCircle,
  Menu,
  MoreVertical,
  Users,
  UserCheck,
  Sparkles,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { STUDENTS, DOMAINS_GRADES, LearningOutcome, Student } from './data';

export default function App() {
  const activeStudent = STUDENTS[0];

  const [view, setView] = useState<"curriculum" | "history" | "assessment">("curriculum");
  const [role, setRole] = useState<"teacher" | "parent" | "student">("teacher");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(DOMAINS_GRADES[STUDENTS[0].grade][0]);
  const [activeTopicDetail, setActiveTopicDetail] = useState<string | null>(null);
  const [selectedSkillEvidence, setSelectedSkillEvidence] = useState<LearningOutcome | null>(null);
  const [modalFilter, setModalFilter] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | "all">("all");
  const [selectedOutcomes, setSelectedOutcomes] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [remarks, setRemarks] = useState(activeStudent.teacherRemarks);
  const [isProcessing, setIsProcessing] = useState<"assessment" | "worksheet" | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentDomains = useMemo(() => 
    DOMAINS_GRADES[activeStudent.grade] || [], 
  [activeStudent.grade]);

  // Strivemath Rainbow System for the donut segments
  const DOMAIN_COLORS = ['#FFA41C', '#FF4F84', '#7058FF', '#2C81ED', '#B0EB33', '#0F1574'];

  // Filter outcomes based on search, domain, and status
  const filteredOutcomes = useMemo(() => {
    return activeStudent.outcomes.filter(outcome => {
      const matchesSearch = outcome.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           outcome.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = !selectedDomain || outcome.domain === selectedDomain;
      const matchesStatus = filterStatus === "all" || outcome.status === filterStatus;
      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [searchQuery, selectedDomain, filterStatus, activeStudent]);

  const toggleOutcomeSelection = (id: string) => {
    const newSelection = new Set(selectedOutcomes);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedOutcomes(newSelection);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'text-accent-green bg-white border-accent-green/20';
      case 'challenging': return 'text-accent-orange bg-white border-accent-orange/20';
      case 'covered': return 'text-accent-purple bg-white border-accent-purple/20';
      default: return 'text-slate-400 bg-white border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'mastered': return 'Mastered';
      case 'challenging': return 'Needs Practice';
      case 'covered': return 'Improving';
      default: return 'Not Practised';
    }
  };

  const handleCreateWorksheet = () => {
    setIsProcessing("worksheet");
    setTimeout(() => {
      setIsProcessing(null);
      setShowResult(true);
    }, 2000);
  };

  const handleUnitAssessment = () => {
    setIsProcessing("assessment");
    setTimeout(() => {
      setIsProcessing(null);
      setShowResult(true);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent-green';
    if (score >= 70) return 'text-accent-blue';
    if (score >= 40) return 'text-accent-orange';
    return 'text-accent-pink';
  };

  // Calculate segments for the donut chart
  const domainEntries = Object.entries(activeStudent.domainProgress);

  const SKILL_EVIDENCE_MOCK = {
    'questions': [
      {
        id: 'q1',
        text: "If a person walks 1/2 mile in each 1/4 hour, what is their speed in miles per hour?",
        studentAnswer: "2 mph",
        correctAnswer: "2 mph",
        isCorrect: true,
        marks: "2/2",
        reasoning: "I calculated the unit rate by dividing 1/2 by 1/4. 1/2 ÷ 1/4 = 1/2 × 4 = 2 miles per hour.",
        timestamp: "Oct 12, 10:45 AM"
      },
      {
        id: 'q2',
        text: "A recipe requires 3/4 cup of sugar for 2 dozen cookies. How much sugar is needed for 5 dozen cookies?",
        studentAnswer: "1.5 cups",
        correctAnswer: "1.875 cups",
        isCorrect: false,
        marks: "0/2",
        reasoning: "I tried to double the recipe mostly, but I forgot the extra 1 dozen calculation.",
        timestamp: "Oct 12, 11:15 AM"
      }
    ]
  };

  return (
    <div className="flex h-screen bg-white text-brand-primary font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-ui-subtle-bg border-r border-slate-100 flex-shrink-0 relative box-border z-30"
      >
        <div className="p-6 overflow-hidden w-[280px]">
          <div className="flex items-center gap-3 px-3 mb-10">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-6 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-brand-primary">Strivemath</h1>
          </div>

          <nav className="space-y-2">
            <div className="px-3 mb-6">
              <div className="bg-ui-subtle-bg p-1 rounded-xl flex flex-col gap-1">
                <div className="flex gap-1">
                  <button 
                    onClick={() => setRole("teacher")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${role === "teacher" ? 'bg-white shadow-card-subtle text-accent-purple' : 'text-brand-primary-light hover:text-brand-primary'}`}
                  >
                    <UserCheck className="w-3 h-3" />
                    Teacher
                  </button>
                  <button 
                    onClick={() => {
                      setRole("parent");
                      setView("curriculum");
                      setSelectedDomain(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${role === "parent" ? 'bg-white shadow-card-subtle text-accent-purple' : 'text-brand-primary-light hover:text-brand-primary'}`}
                  >
                    <Users className="w-3 h-3" />
                    Parent
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setRole("student");
                    setView("curriculum");
                    setSelectedDomain(null);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${role === "student" ? 'bg-white shadow-card-subtle text-accent-purple' : 'text-brand-primary-light hover:text-brand-primary'}`}
                >
                  <PlayCircle className="w-3 h-3" />
                  Student View
                </button>
              </div>
            </div>
            <h2 className="text-[10px] font-black text-brand-primary-light uppercase tracking-[0.2em] mb-4 px-3">Main</h2>
            <button
              onClick={() => { setView("curriculum"); setSelectedDomain(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-sm font-bold transition-all ${view === "curriculum" && !selectedDomain ? 'bg-white shadow-card-subtle text-accent-purple' : 'text-brand-primary-light hover:text-brand-primary'}`}
            >
              <LayoutGrid className="w-4 h-4" />
              Skills
            </button>
            <button
              onClick={() => setView("history")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-sm font-bold transition-all ${view === "history" ? 'bg-white shadow-card-subtle text-accent-purple' : 'text-brand-primary-light hover:text-brand-primary'}`}
            >
              <Clock className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setView("assessment")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-sm font-bold transition-all ${view === "assessment" ? 'bg-white shadow-card-subtle text-accent-purple' : 'text-brand-primary-light hover:text-brand-primary'}`}
            >
              <UserCheck className="w-4 h-4" />
              Assessment
            </button>

            <div className="pt-6">
              <h2 className="text-[10px] font-black text-brand-primary-light uppercase tracking-[0.2em] mb-4 px-3">Curriculum</h2>
              <div className="space-y-1">
                {currentDomains.map(domain => (
                  <button
                    key={domain}
                    onClick={() => { setView("curriculum"); setSelectedDomain(domain); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-button text-[13px] font-bold transition-all ${view === "curriculum" && selectedDomain === domain ? 'bg-white shadow-card-subtle text-accent-purple' : 'text-brand-primary-light hover:text-brand-primary'}`}
                  >
                    <span className="truncate">{domain}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedDomain === domain ? 'rotate-90' : 'opacity-40'}`} />
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        {/* Top Header - Student Personalized Stats */}
        <header className="bg-white border-b border-ui-subtle-bg px-8 py-4 z-20 sticky top-0 backdrop-blur-md bg-white/80 h-[80px] flex items-center">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-8 text-left">
            
            <div className="flex items-center gap-6 shrink-0">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-ui-subtle-bg rounded-lg text-brand-primary-light lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-ui-purple-tint border font-black border-white shadow-sm flex items-center justify-center text-xl">
                    {activeStudent.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-accent-green w-3 h-3 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <h2 className="text-xl font-black text-brand-primary tracking-tighter leading-tight">{activeStudent.name}</h2>
                  <span className="text-[9px] font-black text-accent-purple uppercase tracking-widest">{activeStudent.grade} • {activeStudent.subject}</span>
                </div>
              </div>
            </div>

            {/* Overall Progress and Action Area (Centered for Parent) - Hide on Dashboard for Parent/Student */}
            {((role === 'teacher') || (selectedDomain && (role === 'parent' || role === 'student')) || (view !== 'curriculum' && role !== 'teacher')) && (
              <div className={`flex items-center gap-6 ${role === 'parent' ? 'w-full md:w-2/3 flex-col lg:flex-row justify-center items-center' : ''}`}>
                {/* Overall Progress Chart */}
                <div className={`flex items-center gap-4 bg-white p-2 px-5 rounded-[24px] shadow-card-subtle border border-slate-50 ${role === 'parent' ? 'scale-110 lg:mr-8' : ''}`}>
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="42"
                        fill="none" stroke="#f3f3f8" strokeWidth="12"
                      />
                      {domainEntries.map(([_, progress], i) => {
                        const totalPrev = i * (100 / domainEntries.length);
                        const circumference = 2 * Math.PI * 42;
                        const segmentTotalSize = circumference / domainEntries.length;
                        const segmentProgressSize = (progress / 100) * (segmentTotalSize - 4); // 4px gap
                        return (
                          <circle
                            key={i}
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke={DOMAIN_COLORS[i % DOMAIN_COLORS.length]}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${segmentProgressSize} ${circumference - segmentProgressSize}`}
                            strokeDashoffset={- (i * segmentTotalSize)}
                            className="transition-all duration-1000 ease-in-out"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-black text-brand-primary leading-none">{activeStudent.overallProgress}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-wider">Overall</span>
                    <span className="text-[8px] font-bold text-brand-primary-light uppercase tracking-tighter">Mastery Level</span>
                  </div>
                </div>

                {/* Topics Legend (Boxes for Parent) */}
                <div className={`grid gap-2 ${role === 'parent' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 flex-1' : 'hidden xl:grid grid-cols-2 gap-x-4 gap-y-1'}`}>
                  {domainEntries.map(([name, progress], i) => (
                    <button 
                      key={name}
                      onClick={() => role === 'parent' && setActiveTopicDetail(name)}
                      className={`flex items-center gap-3 p-2 px-3 rounded-xl transition-all text-left ${
                        role === 'parent' 
                          ? 'bg-white border border-slate-100 hover:border-accent-purple/20 hover:shadow-md' 
                          : 'p-0 border-0'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: DOMAIN_COLORS[i % DOMAIN_COLORS.length] }}></div>
                      <div className="min-w-0">
                        <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-tight truncate w-full">{name}</h4>
                        {role === 'parent' && <span className="text-[11px] font-black text-brand-primary-light">{progress}%</span>}
                      </div>
                    </button>
                  ))}
                </div>

                {role === 'teacher' && (
                  <button 
                    onClick={handleCreateWorksheet}
                    disabled={selectedOutcomes.size === 0}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-button font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${
                      selectedOutcomes.size > 0 
                        ? 'rainbow-gradient rainbow-gradient-hover text-white' 
                        : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed grayscale shadow-none'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Create Worksheet
                  </button>
                )}
              </div>
            )}

            {/* Back to Dashboard Button for Parent/Student */}
            {(role === 'parent' || role === 'student') && selectedDomain && (
              <div className="flex-1 flex justify-end">
                <button 
                  onClick={() => setSelectedDomain(null)}
                  className="flex items-center gap-2 px-6 py-3 rounded-button bg-brand-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Filters & Controls - Hidden in Assessment/Parent View & Teacher Workspace */}
        {view !== "assessment" && (role === "teacher" || (selectedDomain && (role === "parent" || role === "student"))) && (
          <div className="px-8 py-3 flex items-center justify-between bg-white border-b border-slate-50 sticky top-[80px] z-20 backdrop-blur-md bg-white/80">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All', icon: BookOpen },
                { id: 'mastered', label: 'Mastered', icon: CheckCircle2 },
                { id: 'challenging', label: 'Needs Focus', icon: AlertCircle },
                { id: 'covered', label: 'Covered', icon: BookOpen },
                { id: 'not-started', label: 'Upcoming', icon: Clock },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-button text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === f.id ? 'bg-brand-primary text-white shadow-md' : 'text-brand-primary-light hover:text-brand-primary hover:bg-ui-subtle-bg'}`}
                >
                  {f.label}
                </button>
              ))}
              
              {/* Contextual Topic Test Action */}
              {selectedDomain && view === "curriculum" && (
                <div className="h-4 w-px bg-slate-100 mx-2" />
              )}
              {selectedDomain && view === "curriculum" && (
                <button 
                  onClick={handleUnitAssessment}
                  className="flex items-center gap-2 px-4 py-2 rounded-button bg-ui-purple-tint text-accent-purple text-[10px] font-black uppercase tracking-widest border border-accent-purple/10 hover:bg-white transition-all"
                >
                  <FileText className="w-3 h-3" />
                  Unit Assessment
                </button>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group hidden md:block">
                <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary-light group-focus-within:text-accent-purple transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-4 py-2 border-b border-ui-subtle-bg rounded-none text-sm w-32 focus:w-48 focus:outline-none focus:border-accent-purple transition-all font-medium placeholder:text-brand-primary-light/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Welcome Messages */}
        {view === "curriculum" && (selectedDomain || role === 'teacher') && (
          <div className="px-8 py-4 bg-ui-purple-tint border-b border-accent-purple/10">
            <p className="text-accent-purple font-bold text-sm">
              {role === 'teacher' 
                ? `👋 Hi Teacher! Here is an overview of ${activeStudent.name.split(' ')[0]}'s learning progress. Select skills to create a worksheet.`
                : `Select skills from the curriculum below to generate a personalised practice worksheet for ${activeStudent.name.split(' ')[0]}.`}
            </p>
          </div>
        )}

        {/* Outcomes List or Dashboard */}
        <div className="flex-1 overflow-y-auto p-6 content-container scroll-smooth">
          <AnimatePresence mode="wait" initial={false}>
            {view === "curriculum" && !selectedDomain && (role === "parent" || role === "student") ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-6xl mx-auto min-h-full flex flex-col items-center justify-center pt-12 md:pt-20 pb-12 md:pb-24"
              >
                <div className="text-center mb-8 md:mb-10">
                  <h2 className="text-2xl md:text-5xl font-black tracking-tight text-brand-primary mb-3">
                    {role === 'parent' ? `How's ${activeStudent.name.split(' ')[0]} doing?` : `Check your progress, ${activeStudent.name.split(' ')[0]}!`}
                  </h2>
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm md:text-lg text-brand-primary-light font-medium">{activeStudent.grade} • {activeStudent.subject}</p>
                    
                    {/* Role-Specific Secondary Banner */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border ${
                        role === 'parent' 
                          ? 'bg-accent-green/5 border-accent-green/10' 
                          : 'bg-accent-purple/5 border-accent-purple/10'
                      }`}
                    >
                      {role === 'parent' ? (
                        <>
                          <div className="p-2 bg-accent-green rounded-lg text-white">
                            <TrendingUp className="w-3 h-3" />
                          </div>
                          <div className="text-left">
                            <p className="text-[9px] font-black text-accent-green uppercase tracking-widest leading-none mb-1">Growth Insight</p>
                            <p className="text-[11px] font-bold text-brand-primary">Growth since last week: +4% in Algebra</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-accent-purple rounded-lg text-white">
                            <Zap className="w-3 h-3" />
                          </div>
                          <div className="text-left">
                            <p className="text-[9px] font-black text-accent-purple uppercase tracking-widest leading-none mb-1">Daily Goal</p>
                            <p className="text-[11px] font-bold text-brand-primary">Complete 3 more questions to hit your goal!</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-16 w-full mb-12">
                  {/* Large Centered Mastery Circle with Role Decoration */}
                  <div className="relative group shrink-0">
                    <div className={`absolute inset-0 rounded-full scale-150 blur-3xl opacity-20 transition-opacity duration-1000 ${role === 'parent' ? 'bg-accent-green/20' : 'bg-accent-purple/20'}`}></div>
                    
                    {/* Floating Achievement Icons for Student */}
                    {role === 'student' && (
                      <>
                        <motion.div 
                          animate={{ y: [0, -10, 0] }} 
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-50 z-10 group/achieve"
                        >
                          <Trophy className="w-5 h-5 text-yellow-500" />
                          <div className="absolute top-0 left-full ml-2 opacity-0 group-hover/achieve:opacity-100 transition-opacity bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded whitespace-nowrap pointer-events-none shadow-lg">
                            Algebra Champion
                          </div>
                        </motion.div>
                        <motion.div 
                          animate={{ y: [0, 10, 0] }} 
                          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                          className="absolute -bottom-2 -left-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-50 z-10 group/achieve"
                        >
                          <Zap className="w-5 h-5 text-accent-purple" />
                          <div className="absolute top-0 right-full mr-2 opacity-0 group-hover/achieve:opacity-100 transition-opacity bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded whitespace-nowrap pointer-events-none shadow-lg">
                            3 Day Streak!
                          </div>
                        </motion.div>
                      </>
                    )}

                    <div className="relative w-48 h-48 md:w-64 md:h-64">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                        <circle
                          cx="50" cy="50" r="42"
                          fill="none" stroke="#f3f3f8" strokeWidth="10"
                        />
                        {domainEntries.map(([_, progress], i) => {
                          const circumference = 2 * Math.PI * 42;
                          const segmentTotalSize = circumference / domainEntries.length;
                          const segmentProgressSize = (progress / 100) * (segmentTotalSize - 2);
                          return (
                            <circle
                              key={i}
                              cx="50" cy="50" r="42"
                              fill="none"
                              stroke={DOMAIN_COLORS[i % DOMAIN_COLORS.length]}
                              strokeWidth="10"
                              strokeLinecap="round"
                              strokeDasharray={`${segmentProgressSize} ${circumference - segmentProgressSize}`}
                              strokeDashoffset={- (i * segmentTotalSize)}
                              className="transition-all duration-1000 ease-in-out"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl md:text-5xl font-black text-brand-primary tracking-tighter">{activeStudent.overallProgress}%</span>
                        <span className="text-[8px] md:text-[10px] font-black text-brand-primary-light uppercase tracking-widest mt-1">Overall Mastery</span>
                      </div>
                    </div>
                  </div>

                  {/* Topic Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 flex-1 max-w-lg w-full">
                    {domainEntries.map(([name, progress], i) => (
                      <motion.button 
                        key={name}
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTopicDetail(name)}
                        className="bg-white p-4 md:p-5 rounded-[24px] md:rounded-[32px] border-2 border-slate-50 shadow-card-subtle text-left flex items-center gap-4 group hover:border-accent-purple/20 transition-all"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: DOMAIN_COLORS[i % DOMAIN_COLORS.length] }}>
                          <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 pointer-events-none" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] md:text-xs font-black text-brand-primary uppercase tracking-tight mb-0.5 truncate leading-tight">{name}</h4>
                          <span className="text-lg md:text-xl font-black text-brand-primary group-hover:text-accent-purple transition-colors">{progress}%</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-6 sm:px-0">
                  <button 
                    onClick={() => setSelectedDomain(domainEntries[0][0])}
                    className="flex-1 sm:flex-none px-6 md:px-10 py-4 md:py-5 rounded-button bg-ui-purple-tint text-accent-purple font-black text-[12px] md:text-sm uppercase tracking-[0.2em] hover:bg-accent-purple hover:text-white border-2 border-accent-purple/10 transition-all flex items-center justify-center gap-3 shadow-sm"
                  >
                    {role === 'parent' ? 'Detailed Report' : 'Explore Curriculum'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {role !== 'teacher' && (
                    <a 
                      href={role === 'parent' ? "https://strivemath.org/worksheet" : "https://strivemath.org/practice"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-6 md:px-10 py-4 md:py-5 rounded-button rainbow-gradient rainbow-gradient-hover text-white font-black text-[12px] md:text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {role === 'parent' ? 'Generate Practice Worksheet' : 'Next Recommended Task'}
                      <Sparkles className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ) : view === "assessment" && remarks ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Teacher's Remarks Section */}
                <div className="bg-white border-2 border-slate-50 p-8 rounded-[40px] shadow-sm">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-8 h-8 rounded-full bg-accent-purple text-white flex items-center justify-center font-black text-sm">1</div>
                    <h3 className="font-black text-xl text-brand-primary">Teacher's Remarks</h3>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <h4 className="text-sm font-black text-brand-primary mb-4">Confidence</h4>
                      <div className="flex gap-2">
                        {['Low', 'Medium', 'High'].map(level => (
                          <button 
                            key={level}
                            onClick={() => role === 'teacher' && setRemarks(prev => prev ? ({ ...prev, confidence: level.toLowerCase() as any }) : prev)}
                            className={`px-6 py-2 rounded-full text-xs font-bold border-2 transition-all ${remarks.confidence === level.toLowerCase() ? 'bg-accent-purple border-accent-purple text-white shadow-lg' : 'bg-white border-slate-100 text-brand-primary-light hover:border-slate-200'} ${role !== 'teacher' ? 'cursor-default' : ''}`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-brand-primary mb-4">Emotional relationship with math</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Dislikes', 'Scared', 'Indifferent', 'Confused', 'Likes', 'Loves'].map(feeling => (
                          <button 
                            key={feeling}
                            onClick={() => role === 'teacher' && setRemarks(prev => prev ? ({ ...prev, emotionalRelationship: feeling.toLowerCase() as any }) : prev)}
                            className={`px-6 py-2 rounded-full text-xs font-bold border-2 transition-all ${remarks.emotionalRelationship === feeling.toLowerCase() ? 'bg-accent-purple border-accent-purple text-white shadow-lg' : 'bg-white border-slate-100 text-brand-primary-light hover:border-slate-200'} ${role !== 'teacher' ? 'cursor-default' : ''}`}
                          >
                            {feeling}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-brand-primary mb-4">Purpose of math classes</h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'cover-basics', label: 'Cover basics' },
                          { id: 'cover-current', label: 'Cover current content' },
                          { id: 'above-and-beyond', label: 'Go above and beyond' }
                        ].map(p => (
                          <button 
                            key={p.id}
                            onClick={() => role === 'teacher' && setRemarks(prev => prev ? ({ ...prev, purpose: p.id as any }) : prev)}
                            className={`px-6 py-2 rounded-full text-xs font-bold border-2 transition-all ${remarks.purpose === p.id ? 'bg-accent-purple border-accent-purple text-white shadow-lg' : 'bg-white border-slate-100 text-brand-primary-light hover:border-slate-200'} ${role !== 'teacher' ? 'cursor-default' : ''}`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cognitive Development Section */}
                <div className="bg-[#fbfcfa] border-2 border-[#f0f4f0] p-8 rounded-[40px] shadow-sm">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-8 h-8 rounded-full bg-accent-purple text-white flex items-center justify-center font-black text-sm">2</div>
                    <h3 className="font-black text-xl text-brand-primary">Cognitive Development</h3>
                  </div>

                  <div className="space-y-6">
                    {[
                      { key: 'memory', icon: '🧠', label: 'Memory and Recall', value: remarks.cognitiveDevelopment.memory, color: 'bg-accent-green' },
                      { key: 'organization', icon: '📋', label: 'Organization of Work', value: remarks.cognitiveDevelopment.organization, color: 'bg-accent-orange' },
                      { key: 'focus', icon: '🎯', label: 'Ability to focus', value: remarks.cognitiveDevelopment.focus, color: 'bg-accent-green' },
                      { key: 'selfServe', icon: '🔍', label: 'Ability to self serve answers', value: remarks.cognitiveDevelopment.selfServe, color: 'bg-accent-orange' },
                      { key: 'avoidingMistakes', icon: '⚠️', label: 'Avoiding careless mistakes', value: remarks.cognitiveDevelopment.avoidingMistakes, color: 'bg-accent-pink' },
                      { key: 'grit', icon: '💪', label: 'Grit/Resilience', value: remarks.cognitiveDevelopment.grit, color: 'bg-accent-green' },
                    ].map(item => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-brand-primary-light">
                          <div className="flex items-center gap-3">
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {role === 'teacher' && <span className="text-[7px] text-accent-purple uppercase tracking-widest font-black">Adjustable</span>}
                            <span className="text-[10px] font-black">{item.value}%</span>
                          </div>
                        </div>
                        <div 
                          className={`w-full bg-slate-100 h-3 rounded-full relative ${role === 'teacher' ? 'cursor-pointer' : 'cursor-default'}`}
                          onClick={(e) => {
                            if (role !== 'teacher') return;
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const percentage = Math.round((x / rect.width) * 100);
                            setRemarks(prev => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                cognitiveDevelopment: {
                                  ...prev.cognitiveDevelopment,
                                  [item.key]: percentage
                                }
                              };
                            });
                          }}
                        >
                          <motion.div 
                            initial={false}
                            animate={{ width: `${item.value}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`h-full ${item.color} rounded-full relative`}
                          >
                            {role === 'teacher' && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-current translate-x-1/2 transition-transform transform hover:scale-110 active:scale-95" />}
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : view === "history" ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 max-w-5xl mx-auto"
              >
                <h3 className="font-black text-xl mb-6">Recent Worksheets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeStudent.practicedWorksheets.map((ws) => (
                    <div key={ws.id} className="bg-white border-2 border-slate-50 p-6 rounded-[24px] hover:shadow-card-subtle transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-lg group-hover:text-accent-purple transition-colors">{ws.title}</h4>
                          <span className="text-[10px] font-bold text-brand-primary-light uppercase tracking-widest">{ws.date}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-black font-mono ${getScoreColor(ws.score)}`}>{ws.score}%</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ws.skills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-ui-subtle-bg text-brand-primary-light text-[9px] font-bold rounded-lg uppercase">{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : filteredOutcomes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-slate-300 gap-2"
              >
                <Search className="w-8 h-8 opacity-10" />
                <p className="font-black text-sm uppercase tracking-widest">No matching results</p>
              </motion.div>
            ) : (
              <motion.div layout className="space-y-2 max-w-7xl mx-auto">
                <div className="hidden sm:grid grid-cols-[36px_1fr_100px_90px] gap-6 px-4 py-2 text-[8px] font-black text-brand-primary-light uppercase tracking-[0.3em]">
                  <div></div>
                  <div>Skill Standard</div>
                  <div className="text-center">Proficiency</div>
                  <div className="text-right">Status</div>
                </div>

                {filteredOutcomes.map((outcome, index) => (
                  <motion.div
                    key={`${activeStudent.id}-${outcome.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.01 }}
                    className={`group grid grid-cols-1 sm:grid-cols-[36px_1fr_100px_90px] items-start sm:items-center gap-3 sm:gap-6 p-4 sm:p-2 sm:px-3 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${selectedOutcomes.has(outcome.id) ? 'border-accent-purple/40 bg-ui-purple-tint/20' : 'border-slate-50 bg-white hover:border-ui-purple-tint'}`}
                  >
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOutcomeSelection(outcome.id);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all shrink-0 cursor-pointer ${selectedOutcomes.has(outcome.id) ? 'bg-accent-purple border-accent-purple text-white shadow-sm' : 'bg-white border-slate-200 text-brand-primary-light hover:border-accent-purple/30'}`}
                    >
                      {selectedOutcomes.has(outcome.id) ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1 h-1 bg-slate-200 rounded-full" />}
                    </div>
                    <div className="flex flex-col min-w-0" onClick={() => {
                       if (outcome.status !== 'not-started') {
                         setSelectedSkillEvidence(outcome);
                       } else {
                         toggleOutcomeSelection(outcome.id);
                       }
                    }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black bg-brand-primary text-white px-1.5 py-0.5 rounded shadow-sm leading-none shrink-0">
                          {outcome.code}
                        </span>
                        <span className="text-[7px] font-black text-brand-primary-light uppercase tracking-[0.2em] truncate">{outcome.domain}</span>
                        {outcome.status !== 'not-started' && (
                          <span className="text-[7px] font-black text-accent-purple uppercase tracking-widest flex items-center gap-1 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-2 h-2" />
                            Practised Ques
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-brand-primary transition-all group-hover:text-accent-purple leading-tight">
                        {outcome.title}
                      </h3>
                      <p className="text-[10px] text-ui-text-muted line-clamp-1 italic font-medium hidden sm:block">{outcome.description}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-1 order-3 sm:order-none" onClick={() => toggleOutcomeSelection(outcome.id)}>
                       <span className="text-[10px] font-bold text-brand-primary-light sm:hidden uppercase tracking-widest">Proficiency:</span>
                       <span className={`text-xs font-black font-mono tracking-tighter ${getScoreColor(outcome.score)}`}>
                         {outcome.score}%
                       </span>
                       <div className="w-24 sm:w-full bg-slate-100 h-1.5 sm:h-1 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${outcome.score}%` }}
                          className="h-full bg-brand-primary"
                        />
                      </div>
                    </div>

                    <div className="flex sm:justify-end order-2 sm:order-none absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto" onClick={() => toggleOutcomeSelection(outcome.id)}>
                      <span className={`px-2 py-1 sm:py-0.5 rounded-md text-[8px] font-black border uppercase tracking-tight ${getStatusColor(outcome.status)} truncate shadow-sm`}>
                        {getStatusLabel(outcome.status)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar - More Streamlined */}
        <AnimatePresence>
          {selectedOutcomes.size > 0 && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-brand-primary shadow-dramatic rounded-[24px] p-4 px-6 flex flex-row items-center justify-between z-40 border border-white/5"
            >
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                  <span className="text-xl font-black relative z-10">1</span>
                </div>
                <div>
                  <h4 className="text-white text-base font-black tracking-tight leading-none">
                    {role === 'teacher' ? 'Worksheet' : 'Practice Set'} for {activeStudent.name.split(' ')[0]}
                  </h4>
                  <p className="text-white/50 text-[8px] font-bold uppercase tracking-widest mt-1">
                    {selectedOutcomes.size} outcome{selectedOutcomes.size > 1 ? 's' : ''} targeted
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedOutcomes(new Set())}
                  className="px-4 py-2 rounded-button text-white/50 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest"
                >
                  Clear Selection
                </button>
                <button 
                  onClick={handleCreateWorksheet}
                  className="rainbow-gradient rainbow-gradient-hover text-white px-6 py-3 rounded-button font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  {role === 'student' ? 'Start Practice' : 'Create Worksheet'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Modal */}
        <AnimatePresence>
          {isProcessing && (
            <div className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-10 rounded-[40px] shadow-dramatic text-center max-w-sm w-full"
              >
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 border-4 border-accent-purple/10 border-t-accent-purple rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    {isProcessing === "assessment" ? "📊" : "📝"}
                  </div>
                </div>
                <h3 className="text-xl font-black mb-2">
                  {isProcessing === "assessment" ? "Generating Unit Assessment" : "Building Your Worksheet"}
                </h3>
                <p className="text-brand-primary-light text-sm font-medium">
                  {isProcessing === "assessment" 
                    ? "Our AI is mapping questions to the selected topic standard." 
                    : `Personalizing questions for ${selectedOutcomes.size} selected skills.`}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Result Overlay */}
        <AnimatePresence>
          {showResult && (
            <div className="fixed inset-0 bg-brand-primary/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white w-full max-w-2xl rounded-[40px] shadow-dramatic overflow-hidden"
              >
                  <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-ui-purple-tint">
                    <div className="flex items-center gap-4">
                      <div className="bg-accent-purple p-3 rounded-2xl text-white">
                        {role === 'teacher' ? <CheckCircle2 className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-brand-primary">
                          {role === 'teacher' ? 'Worksheet Ready!' : 'Practice Started!'}
                        </h3>
                        <p className="text-[10px] font-black text-accent-purple uppercase tracking-widest mt-1">Generated by Strive AI</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setShowResult(false); setSelectedOutcomes(new Set()); }}
                      className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                
                <div className="p-10 space-y-8">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <span className="text-[10px] font-black text-brand-primary-light uppercase tracking-[0.2em] block mb-2">Duration</span>
                        <span className="text-xl font-black">45 Minutes</span>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <span className="text-[10px] font-black text-brand-primary-light uppercase tracking-[0.2em] block mb-2">Items</span>
                        <span className="text-xl font-black">24 Questions</span>
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-brand-primary-light mb-4">Targeted Skills</h4>
                      <div className="space-y-2">
                         {Array.from(selectedOutcomes).map((id: string) => {
                            const outcome = activeStudent.outcomes.find(o => o.id === id);
                            return (
                              <div key={id} className="flex items-center gap-3 p-2 px-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <span className="text-[8px] font-black bg-brand-primary text-white px-2 py-0.5 rounded uppercase">{outcome?.code}</span>
                                <span className="text-xs font-bold">{outcome?.title}</span>
                              </div>
                            );
                         })}
                      </div>
                   </div>

                   <div className="flex gap-4">
                     <button 
                      onClick={() => { setShowResult(false); setSelectedOutcomes(new Set()); }}
                      className="flex-1 bg-ui-purple-tint text-accent-purple py-5 rounded-button font-black text-xs uppercase tracking-[0.2em] hover:bg-white border-2 border-accent-purple/10 transition-all"
                     >
                       Save to History
                     </button>
                     <a 
                      href="https://strivemath.org/worksheet" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-[1.5] rainbow-gradient rainbow-gradient-hover text-white py-5 rounded-button font-black text-xs uppercase tracking-[0.2em] shadow-xl text-center flex items-center justify-center gap-3"
                     >
                        {role === 'teacher' ? 'Open Live Worksheet' : 'Start Solving Now'}
                        <ChevronRight className="w-4 h-4" />
                     </a>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Topic Detail Modal for Parent View */}
        <AnimatePresence>
          {activeTopicDetail && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
              onClick={() => setActiveTopicDetail(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[40px] shadow-dramatic overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-ui-subtle-bg">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[domainEntries.findIndex(([name]) => name === activeTopicDetail) % DOMAIN_COLORS.length] }}></div>
                    <h3 className="text-2xl font-black text-brand-primary tracking-tight">{activeTopicDetail}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveTopicDetail(null)}
                    className="p-2 hover:bg-white rounded-full transition-colors shadow-sm cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-10 space-y-10">
                        <div className="flex items-center justify-between mb-8">
                           <div>
                             <h3 className="text-2xl font-black tracking-tight text-brand-primary">Growth Overview</h3>
                             <p className="text-xs text-brand-primary-light font-medium mt-1">Nia is overall **Improving** in most topics this month.</p>
                           </div>
                        </div>

                  {/* Skills Drill-down */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                       <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest">Topic Standards</h4>
                       {modalFilter !== 'all' && (
                         <button onClick={() => setModalFilter('all')} className="text-[9px] font-black text-accent-purple uppercase tracking-widest hover:underline">Show All</button>
                       )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {activeStudent.outcomes
                        .filter(o => o.domain === activeTopicDetail && (modalFilter === 'all' || o.status === modalFilter))
                        .map((outcome) => (
                          <div 
                            key={outcome.id} 
                            className={`w-full flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl group transition-all text-left ${outcome.status !== 'not-started' ? 'hover:border-accent-purple/40 hover:bg-white' : 'opacity-60'}`}
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOutcomeSelection(outcome.id);
                              }}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 cursor-pointer ${selectedOutcomes.has(outcome.id) ? 'bg-accent-purple border-accent-purple text-white shadow-sm' : 'bg-white border-slate-200 text-brand-primary-light hover:border-accent-purple/30'}`}
                            >
                              {selectedOutcomes.has(outcome.id) ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1 h-1 bg-slate-200 rounded-full" />}
                            </button>
                            
                            <div 
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => outcome.status !== 'not-started' && setSelectedSkillEvidence(outcome)}
                            >
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[9px] font-black bg-brand-primary text-white px-1.5 py-0.5 rounded uppercase shrink-0">{outcome.code}</span>
                                {outcome.status !== 'not-started' && (
                                  <span className="text-[8px] font-black text-accent-purple uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles className="w-2 h-2" />
                                    Evidence
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-bold text-brand-primary leading-tight truncate">{outcome.title}</p>
                            </div>
                            
                            <div className={`shrink-0 w-2 h-2 rounded-full ${
                              outcome.status === 'mastered' ? 'bg-accent-green' :
                              outcome.status === 'challenging' ? 'bg-accent-orange' :
                              outcome.status === 'covered' ? 'bg-accent-purple' : 'bg-slate-300'
                            }`} />
                          </div>
                        ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedDomain(activeTopicDetail);
                      setView('curriculum');
                      setActiveTopicDetail(null);
                    }}
                    className="w-full bg-brand-primary text-white py-5 rounded-button font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    Explore Detail Curriculum view
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skill Evidence Side Panel */}
        <AnimatePresence>
          {selectedSkillEvidence && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[70] flex justify-end"
              onClick={() => setSelectedSkillEvidence(null)}
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-accent-purple uppercase tracking-widest mb-1">Skill Evidence Breakdown</span>
                    <h3 className="text-xl font-black text-brand-primary tracking-tight">{selectedSkillEvidence.code}: {selectedSkillEvidence.title}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleOutcomeSelection(selectedSkillEvidence.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${selectedOutcomes.has(selectedSkillEvidence.id) ? 'bg-accent-purple border-accent-purple text-white shadow-md' : 'bg-white border-slate-200 text-brand-primary-light hover:border-accent-purple/30'}`}
                    >
                      {selectedOutcomes.has(selectedSkillEvidence.id) ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          Select for Worksheet
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setSelectedSkillEvidence(null)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12 content-container">
                  {/* Summary Metric */}
                  <div className="flex items-center gap-8 bg-ui-purple-tint/30 p-8 rounded-[32px] border border-accent-purple/10">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="10" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray={`${selectedSkillEvidence.score * 2.64} 264`} className="text-accent-purple transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-brand-primary">{selectedSkillEvidence.score}%</div>
                    </div>
                    <div>
                      <h4 className="font-black text-brand-primary mb-1">Recent Accuracy</h4>
                      <p className="text-xs text-brand-primary-light font-medium leading-relaxed">
                        Data from the last 24 Practice items. {activeStudent.name.split(' ')[0]} shows strong conceptual understanding but is currently focusing on {selectedSkillEvidence.status === 'challenging' ? 'computational precision' : 'more complex word problems'}.
                      </p>
                    </div>
                  </div>

                  {/* Question Feed */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-brand-primary-light uppercase tracking-widest flex items-center gap-3">
                      Question Level Proof
                      <div className="h-px bg-slate-100 flex-1"></div>
                    </h4>
                    
                    {SKILL_EVIDENCE_MOCK.questions.map((q, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={q.id} 
                        className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-sm"
                      >
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{q.timestamp}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${q.isCorrect ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-pink/10 text-accent-pink'}`}>
                            {q.isCorrect ? 'CORRECT' : 'INCORRECT'} • {q.marks}
                          </span>
                        </div>
                        <div className="p-8 space-y-6">
                          <div>
                            <p className="text-sm font-black text-brand-primary tracking-tight leading-relaxed">{q.text}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                              <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Student Answer</span>
                              <span className={`text-sm font-bold ${q.isCorrect ? 'text-accent-green' : 'text-accent-pink'}`}>{q.studentAnswer}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                              <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Correct Answer</span>
                              <span className="text-sm font-bold text-brand-primary">{q.correctAnswer}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .content-container::-webkit-scrollbar {
          width: 8px;
        }
        .content-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .content-container::-webkit-scrollbar-thumb {
          background: rgba(15, 21, 116, 0.05);
          border-radius: 20px;
        }
        .content-container::-webkit-scrollbar-thumb:hover {
          background: rgba(15, 21, 116, 0.1);
        }
      `}} />
    </div>
  );
}
