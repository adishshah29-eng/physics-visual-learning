import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const examOptions = [
  { value: 'jee-main', batch: 'JEE2025', label: 'JEE Main 2025', color: 'sky' },
  { value: 'jee-main', batch: 'JEE2026', label: 'JEE Main 2026', color: 'sky' },
  { value: 'jee-main', batch: 'JEE2027', label: 'JEE Main 2027', color: 'sky' },
  { value: 'jee-advanced', batch: 'JEE2025', label: 'JEE Advanced 2025', color: 'violet' },
  { value: 'jee-advanced', batch: 'JEE2026', label: 'JEE Advanced 2026', color: 'violet' },
  { value: 'jee-advanced', batch: 'JEE2027', label: 'JEE Advanced 2027', color: 'violet' },
  { value: 'mht-cet', batch: 'MHT2025', label: 'MHT CET 2025', color: 'emerald' },
  { value: 'mht-cet', batch: 'MHT2026', label: 'MHT CET 2026', color: 'emerald' },
];

const levelOptions = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting physics prep', emoji: '🌱' },
  { value: 'intermediate', label: 'Intermediate', description: 'Covered basics, building on them', emoji: '📚' },
  { value: 'advanced', label: 'Advanced', description: 'Strong foundation, polishing skills', emoji: '🚀' },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, signOut } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState(user?.user_metadata?.name || user?.user_metadata?.full_name || '');
  const [selectedExam, setSelectedExam] = useState<typeof examOptions[0] | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return selectedExam !== null;
    if (step === 3) return selectedLevel !== '';
    return false;
  };

  const handleNext = () => {
    if (step < 3 && canProceed()) {
      setErrorMsg(null);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setErrorMsg(null);
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!canProceed() || !user || !selectedExam) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const { error } = await updateProfile({
        id: user.id,
        name: name.trim(),
        email: user.email || '',
        batch: selectedExam.batch,
        target_exam: selectedExam.value,
        avatar_url: user.user_metadata?.avatar_url || null,
      });

      if (error) {
        setErrorMsg(error);
        return;
      }

      navigate('/home', { replace: true });
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const base = isSelected
      ? color === 'sky'
        ? 'border-sky-500 bg-sky-500/10'
        : color === 'violet'
        ? 'border-violet-500 bg-violet-500/10'
        : 'border-emerald-500 bg-emerald-500/10'
      : 'border-slate-700 hover:border-slate-600 bg-slate-900';
    return base;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-2 text-sky-400 mb-4 cursor-pointer" onClick={() => navigate('/')}>
            <Atom className="w-6 h-6" />
            <span className="font-bold tracking-wider">PHYSICS.LAB</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Let&apos;s set up your profile</h1>
          <button 
            onClick={async () => {
              await signOut();
              navigate('/', { replace: true });
            }}
            className="absolute top-0 right-0 text-slate-500 hover:text-white text-xs font-semibold py-1 px-3 border border-slate-800 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  s === step
                    ? 'bg-sky-500 text-white'
                    : s < step
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 transition-colors duration-300 ${
                    s < step ? 'bg-sky-500' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {errorMsg}
            </div>
          )}
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  What should we call you?
                </h2>
                <p className="text-slate-400 text-sm">
                  This name will appear on leaderboards and your profile.
                </p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-colors text-lg"
                placeholder="Your name"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Exam */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  Which exam are you preparing for?
                </h2>
                <p className="text-slate-400 text-sm">
                  We&apos;ll customize your experience based on your target exam.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {examOptions.map((exam) => (
                  <button
                    key={`${exam.value}-${exam.batch}`}
                    onClick={() => setSelectedExam(exam)}
                    className={`p-4 rounded-lg border text-left transition-all duration-200 ${getColorClasses(
                      exam.color,
                      selectedExam?.batch === exam.batch && selectedExam?.value === exam.value
                    )}`}
                  >
                    <div className="font-semibold text-white text-sm">{exam.label}</div>
                    <div className="text-xs text-slate-400 mt-1 capitalize">
                      {exam.value.replace('-', ' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Level */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  How would you rate yourself in Physics?
                </h2>
                <p className="text-slate-400 text-sm">
                  This helps us suggest the right difficulty level.
                </p>
              </div>
              <div className="space-y-3">
                {levelOptions.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value)}
                    className={`w-full p-4 rounded-lg border text-left transition-all duration-200 flex items-center gap-4 ${
                      selectedLevel === level.value
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-900'
                    }`}
                  >
                    <span className="text-2xl">{level.emoji}</span>
                    <div>
                      <div className="font-semibold text-white">{level.label}</div>
                      <div className="text-xs text-slate-400">{level.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed() || isSubmitting}
                className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
