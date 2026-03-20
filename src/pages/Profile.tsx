import React from 'react';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { User, Mail, Shield, Calendar, Edit3, Award } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile } = useAuthStore();

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

          <button className="absolute -bottom-6 right-8 glass-panel px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:border-sky-500/50 transition-colors flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>

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
                <div className="flex flex-col items-center justify-center py-8 text-slate-500 border border-slate-800/50 rounded-xl bg-slate-900/20 border-dashed">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                    <ActivityIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-400 mb-1">No recent activity found</p>
                  <p className="text-xs text-slate-500">Start practicing to track your journey here.</p>
                </div>
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
