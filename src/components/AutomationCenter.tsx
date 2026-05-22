import React, { useState } from 'react';
import { MessageSquare, Bell, Zap, Send, ShieldCheck, Clock, CheckCircle2, AlertTriangle, Terminal, Phone, ExternalLink } from 'lucide-react';
import { Member } from '../types';
import { getWhatsAppLink, WHATSAPP_TEMPLATES } from '../services/whatsappService';
import { motion, AnimatePresence } from 'motion/react';

interface AutomationCenterProps {
  members: Member[];
  onSendBulk: (type: 'welcome' | 'reminder' | 'expiry') => void;
}

const AutomationCenter: React.FC<AutomationCenterProps> = ({ members, onSendBulk }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNotifyId, setActiveNotifyId] = useState<string | null>(null);

  const dueMembers = members.filter(m => {
    const dueDate = new Date(m.dueDate);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    return dueDate <= threeDaysFromNow && dueDate >= now;
  });

  const overdueMembers = members.filter(m => new Date(m.dueDate) < new Date());

  const filteredNotificationMembers = [...dueMembers, ...overdueMembers].filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Automation Engine</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Smart notifications and AMRAP WhatsApp triggers.</p>
        </div>
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
           <CheckCircle2 className="text-green-500" size={16} />
           <span className="text-[10px] font-black tracking-widest text-green-400 uppercase">ENGINE OPTIMAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rules Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-600/30">
                    <ShieldCheck className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight uppercase">Protocol Rules</h3>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Welcome Protocol', desc: 'Auto-send on registration', icon: MessageSquare, status: 'active' },
                { label: 'T-3 Reminder', desc: 'Pre-expiry notification', icon: Clock, status: 'active' },
                { label: 'T-0 Expiry Alert', desc: 'Sent on membership end', icon: Bell, status: 'active' },
                { label: 'Fortress Access', desc: 'Entrance confirmation', icon: Zap, status: 'inactive' },
              ].map((rule, i) => (
                <div key={i} className="flex items-center gap-5 bg-white/2 p-5 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all group">
                  <div className={`w-12 h-12 ${rule.status === 'active' ? 'bg-red-600/10' : 'bg-slate-800'} rounded-2xl flex items-center justify-center shrink-0 border border-white/5`}>
                    <rule.icon className={rule.status === 'active' ? 'text-red-500' : 'text-slate-600'} size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-200">{rule.label}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{rule.desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${rule.status === 'active' ? 'bg-red-600 shadow-inner' : 'bg-slate-800'}`}>
                     <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${rule.status === 'active' ? 'right-1 shadow-lg' : 'left-1 opacity-20'}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-red-600/5 border border-red-600/20 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <AlertTriangle className="text-red-500" size={24} />
                  <p className="text-xs font-medium text-slate-300">WhatsApp API (Twilio) Status: Sandbox Only</p>
               </div>
               <a 
                href="https://console.twilio.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-[10px] font-black bg-red-600 text-white px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg shadow-red-600/20 text-center"
               >
                CONFIG
               </a>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <h3 className="text-lg font-black italic tracking-tight uppercase">Manual Pulse Links</h3>
               <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Search titans..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-xs focus:outline-none focus:border-red-500 transition-colors"
                />
                <Bell size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
               </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredNotificationMembers.map((member) => (
                <div key={member.id} className="relative">
                  <div className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-[1.5rem] hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                        <Phone className="text-red-500" size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{member.fullName}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                          {new Date(member.dueDate) < new Date() ? 'Status: EXPIRED' : 'Status: DUE SOON'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActiveNotifyId(activeNotifyId === member.id ? null : member.id!)}
                        className={`p-2.5 rounded-xl transition-all shadow-lg active:scale-90 flex items-center gap-2 px-4 ${
                          activeNotifyId === member.id ? 'bg-brand-red text-white' : 'bg-green-600 text-white hover:bg-green-500'
                        }`}
                      >
                        <MessageSquare size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Notify</span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeNotifyId === member.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-gym-gray border border-white/10 rounded-2xl shadow-2xl z-50 p-2 backdrop-blur-xl"
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
                                <MessageSquare size={14} className="text-brand-red" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">{tpl.label}</span>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              {filteredNotificationMembers.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest italic">No pending notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Console / System Logs */}
        <div className="bg-[#050505] p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl flex flex-col space-y-6 self-start lg:sticky lg:top-8">
           <div className="flex items-center gap-3">
              <Terminal className="text-red-600" size={20} />
              <h3 className="text-lg font-black tracking-tight italic uppercase">System Core</h3>
           </div>

           <div className="flex-1 font-mono text-[10px] overflow-hidden relative">
              <div className="space-y-3 opacity-50">
                 <p className="text-green-500">[SYSTEM] Initialization complete...</p>
                 <p className="text-slate-400">[CRON] Checking member databases...</p>
                 <p className="text-red-600">[ALERT] Titan #{Math.floor(Math.random()*9000)+1000} membership expired.</p>
                 <p className="text-green-500 text-xs">[WHATSAPP] Gateway connected - iron-titan-api-v2</p>
                 <p className="text-slate-500">[LOG] Message queue: 0 pending</p>
                 <p className="text-slate-500">[LOG] Memory usage: 128MB</p>
                 <p className="text-slate-500">[LOG] Uptime: 42 days 12h</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050505] to-transparent" />
           </div>

           <div className="space-y-4 pt-6 border-t border-white/5">
              <button 
                onClick={() => onSendBulk('reminder')}
                disabled={dueMembers.length === 0}
                className="w-full bg-green-500 text-white font-black text-[10px] tracking-widest uppercase py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20 disabled:opacity-30 disabled:grayscale"
              >
                <Send size={16} />
                Blast {dueMembers.length} Expiring Titans
              </button>
              <button 
                onClick={() => onSendBulk('expiry')}
                disabled={overdueMembers.length === 0}
                className="w-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 font-black text-[10px] tracking-widest uppercase py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-30"
              >
                <Bell size={16} />
                Notify {overdueMembers.length} Expired
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationCenter;
