import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { User, Mail, Shield, Calendar, Edit3, Award, Loader2, Check, X, BookOpen, Sparkles } from 'lucide-react';
import { getAttemptsByUser } from '@/lib/supabase-helpers';
import type { Attempt } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';
import ProBadge from '@/components/ProBadge';

const Profile: React.FC = () => {
  const { profile, updateProfile } = useAuthStore();
  const { isPro, isFreeRestricted, openPaywall } = useSubscription();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  useEffect(() => {
    if (profile) {
      setNewName(profile.name);
      loadActivity();
    }
  }, [profile]);

  const loadActivity = async () => {
    if (!profile?.id) return;
    setIsLoadingActivity(true);
    try {
      const attempts = await getAttemptsByUser(profile.id, { limit: 5 });
      setRecentActivity(attempts);
    } catch (err) {
      console.error('Error loading activity:', err);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim() || newName === profile?.name) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    const { error } = await updateProfile({ name: newName.trim() });
    setIsUpdating(false);
    if (!error) setIsEditing(false);
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n.charAt(0)).join('').toUpperCase().slice(0, 2);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Member since long ago';
    const d = new Date(dateString);
    return `Joined ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  const profileData = profile as any;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 md:pt-32 pb-16 px-4 sm:px-6 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Profile Header */}
        <div className="w-full relative mb-16">
          <div className="h-48 rounded-2xl bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-slate-900/40 border border-slate-700/50 shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent"></div>
          </div>
          
          <div className="absolute -bottom-12 left-8 flex items-end gap-6">
            <div className="w-32 h-32 rounded-2xl bg-slate-900 border-4 border-slate-950 shadow-xl overflow-hidden flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 z-0"></div>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover relative z-10" />
              ) : (
                <span className="text-4xl font-display text-sky-400 relative z-10">{getInitials(profile?.name || 'User Name')}</span>
              )}
            </div>
            
            <div className="mb-2">
              <h1 className="text-3xl font-display tracking-wide text-white flex items-center gap-3">
                {profile?.name || 'Student Name'}
                {isPro && <ProBadge size="md" />}
                {profileData?.role === 'admin' && (
                  <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <Shield className="w-3 h-3" /> ADMIN
                  </span>
                )}
              </h1>
              <p className="text-slate-400 font-sans flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" /> {profile?.email || 'student@example.com'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-8 glass-panel px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:border-sky-500/50 transition-colors flex items-center gap-2 group"
          >
            <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                disabled={isUpdating}
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-display text-white mb-6">Edit Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all"
                    placeholder="Enter your name"
                    autoFocus
                    disabled={isUpdating}
                  />
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating || !newName.trim()}
                    className="flex-1 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                    className="px-6 py-3 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Details */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (About & Meta) */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-display text-white mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Role</p>
                    <p className="text-slate-300 text-sm capitalize">{profileData?.role || 'Student'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Joined</p>
                    <p className="text-slate-300 text-sm">{formatDate(profile?.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade card for free post-trial users */}
            {isFreeRestricted && (
              <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border border-violet-500/20">
                <div className="absolute top-0 right-0 w-32 h-24 bg-violet-500/8 blur-3xl pointer-events-none" />
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-violet-500/15 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">Upgrade to Pro</p>
                    <p className="text-xs text-slate-400">Unlimited questions, all subjects & AI Tutor.</p>
                  </div>
                </div>
                <button
                  onClick={() => openPaywall('profile')}
                  className="w-full text-sm font-bold py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all hover:scale-[1.02]"
                >
                  Start 10-day Free Trial
                </button>
                <p className="text-xs text-slate-500 text-center mt-2">No card required</p>
              </div>
            )}
          </div>

          {/* Right Column (Achievements / Activity Placeholder) */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl group-hover:bg-sky-500/10 transition-colors"></div>
              
              <div className="flex items-center justify-between mb-6 relative">
                <h3 className="text-lg font-display text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-sky-400" /> Recent Activity
                </h3>
              </div>

              <div className="space-y-4 relative">
                {isLoadingActivity ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mb-2 text-sky-400" />
                    <p className="text-xs uppercase tracking-widest font-bold">Fetching updates...</p>
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((attempt: any) => (
                      <div key={attempt.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-800/50 bg-slate-900/30 hover:bg-slate-900/50 transition-colors group">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          attempt.is_correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">
                            {attempt.questions?.chapter?.replace(/-/g, ' ').toUpperCase() || 'PRACTICE'}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                            {new Date(attempt.created_at).toLocaleDateString()} • {attempt.questions?.subject || 'JEE'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold font-mono ${
                            attempt.is_correct ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {attempt.is_correct ? 'CORRECT' : 'WRONG'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500 border border-slate-800/50 rounded-xl bg-slate-900/20 border-dashed">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                      <ActivityIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-400 mb-1">No recent activity found</p>
                    <p className="text-xs text-slate-500">Start practicing to track your journey here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export default Profile;
