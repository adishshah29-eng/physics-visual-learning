import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Mail, BarChart3, ChevronRight, Loader2, Shield, Users, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getAdminUsers } from '@/lib/supabase-helpers';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await getAdminUsers();
    setUsers(data);
    setIsLoading(false);
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const activeToday = users.filter(u => u.last_seen && u.last_seen.startsWith(today)).length;
    return {
      total: users.length,
      activeToday,
      admins: users.filter(u => u.role === 'admin').length
    };
  }, [users]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 md:pt-24 pb-16 px-4 sm:px-6 w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-display tracking-wide text-white flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-sky-400" />
              Admin Portal
            </h1>
            <p className="text-slate-400 font-sans text-sm">Monitor user activity and performance metrics.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-panel px-4 py-2 rounded-xl text-center min-w-[100px]">
              <div className="text-xl font-mono font-bold text-white">{stats.total}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Students</div>
            </div>
            <div className="glass-panel px-4 py-2 rounded-xl text-center min-w-[100px]">
              <div className="text-xl font-mono font-bold text-emerald-400">{stats.activeToday}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active Today</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search students by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        {/* User List */}
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-4" />
              <p className="text-xs uppercase tracking-widest font-bold">Accessing student registry...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No students found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Student</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Stats</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Batch</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Last Seen</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredUsers.map((u) => {
                    const lb = u.leaderboard_scores?.[0] || {};
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">
                              {u.avatar_url ? (
                                <img src={u.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                u.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white flex items-center gap-2">
                                {u.name}
                                {u.role === 'admin' && <Shield className="w-3 h-3 text-sky-400" />}
                              </p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5" title="Score">
                              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                              <span className="text-xs font-mono text-slate-300">{lb.total_score || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Questions Solved">
                              <Users className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="text-xs font-mono text-slate-300">{lb.questions_solved || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/50">
                            {u.batch || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {u.last_seen ? new Date(u.last_seen).toLocaleDateString() : 'Never'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            to={`/admin/analytics/${u.id}`}
                            className="bg-slate-800 hover:bg-sky-500/20 hover:text-sky-400 text-slate-400 p-2 rounded-lg transition-all flex items-center justify-center"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
