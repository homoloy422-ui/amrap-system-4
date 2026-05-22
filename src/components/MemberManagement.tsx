import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  MessageCircle, 
  Edit2, 
  Trash2, 
  UserPlus,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Users
} from 'lucide-react';
import { Member, Plan } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsAppLink, WHATSAPP_TEMPLATES } from '../services/whatsappService';

interface MemberManagementProps {
  members: Member[];
  plans: Plan[];
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ 
  members, 
  plans, 
  onAddMember, 
  onEditMember, 
  onDeleteMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [activeNotifyId, setActiveNotifyId] = useState<string | null>(null);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Members</h2>
          <p className="text-white/50 mt-1">Manage your titan community of {members.length} members.</p>
        </div>
        <button 
          onClick={onAddMember}
          className="bg-brand-red text-white red-glow-strong px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-red-dark transition-all scale-100 hover:scale-105 active:scale-95"
        >
          <UserPlus size={20} />
          New Member
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gym-gray border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-red/50 transition-colors"
          />
        </div>
        <div className="flex bg-gym-gray border border-white/10 rounded-xl p-1">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === 'all' ? 'bg-brand-red text-white' : 'text-white/40 hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === 'active' ? 'bg-brand-red text-white' : 'text-white/40 hover:text-white'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilterStatus('inactive')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === 'inactive' ? 'bg-brand-red text-white' : 'text-white/40 hover:text-white'}`}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMembers.map((member) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={member.id}
              className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-lg group flex flex-col gap-4 relative overflow-hidden transition-all hover:bg-white/10 shadow-xl shadow-black/20"
            >
              <div className={`absolute top-0 right-0 w-1 h-full ${member.status === 'active' ? 'bg-green-500' : 'bg-red-500/50'}`} />
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Users className="text-white/20" size={32} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate mb-1 text-white tracking-tight">{member.fullName}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <Phone size={10} />
                    <span>{member.phone}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditMember(member)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDeleteMember(member.id!)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Rank</p>
                  <p className="text-xs font-bold text-slate-200">
                    {plans.find(p => p.id === member.planId)?.name || member.planId || 'Titan Elite'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Expiry</p>
                  <p className={`text-xs font-bold ${new Date(member.dueDate) < new Date() ? 'text-red-500' : 'text-slate-200'}`}>
                    {new Date(member.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 relative">
                <button
                  onClick={() => setActiveNotifyId(activeNotifyId === member.id ? null : member.id!)}
                  className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    activeNotifyId === member.id 
                      ? 'bg-brand-red text-white' 
                      : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                  }`}
                >
                  <MessageCircle size={14} />
                  Notify
                </button>

                <AnimatePresence>
                  {activeNotifyId === member.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gym-gray border border-white/10 rounded-2xl shadow-2xl z-50 backdrop-blur-xl"
                    >
                      <div className="flex flex-col gap-1">
                        {WHATSAPP_TEMPLATES.map((tpl) => (
                          <a
                            key={tpl.id}
                            href={getWhatsAppLink(member, tpl.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setActiveNotifyId(null)}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              <MessageCircle size={14} className="text-brand-red" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 group-hover:text-white">{tpl.label}</span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                   onClick={() => onEditMember(member)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Profile
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="text-center py-20 glass-card">
          <Users className="mx-auto text-white/10 mb-4" size={48} />
          <p className="text-white/40">No members found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
