import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ShieldCheck,
  Plus,
  CheckCircle,
  Building2,
  Lock,
  ArrowRight,
  UserPlus,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { DonorGroup } from '../types';

export const U5GroupsPage: React.FC = () => {
  const { groups, createGroup, toggleJoinGroup, currentUser, addToast } = useApp();

  // Create group form
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DonorGroup['category']>('Emergency Vanguard');

  const isVerifiedUser = currentUser.isVerified || currentUser.role === 'doctor';

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !description.trim()) {
      addToast('Missing Information', 'Please provide group name and purpose.', 'error');
      return;
    }

    const success = createGroup(groupName.trim(), description.trim(), category);
    if (success) {
      setGroupName('');
      setDescription('');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F2A6B] bg-[#E6E6F2] px-2.5 py-0.5 rounded-md">
              U5 – Community Groups
            </span>
            <span className="text-xs text-slate-500">Verified Blood Networks & Rapid Squads</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            To Create a New Group & Available Groups to Join
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Join volunteer clusters tailored by blood phenotype or emergency response zone. Verified members can found new donor battalions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#E6E6F2]/70 px-3.5 py-2 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-[#1F2A6B]">
            Status: {isVerifiedUser ? 'Verified Creator' : 'Standard Member'}
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left "To create a new group", Right "Available groups to join" (Page 5 Wireframe) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: TO CREATE A NEW GROUP */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F2A6B] bg-[#E6E6F2] px-2.5 py-1 rounded-md">
              Group Founder Portal
            </span>
            {isVerifiedUser ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Access
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Lock className="w-3.5 h-3.5" />
                Verified Users Only
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">
            To Create a New Group
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Create an official donor collective for your local hospital, neighborhood council, or rare antigen brigade.
          </p>

          {!isVerifiedUser && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Group creation requires user verification or medical credentials to ensure transfusion safety.
              </span>
            </div>
          )}

          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Group / Network Name
              </label>
              <input
                type="text"
                disabled={!isVerifiedUser}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. West District O+ Rapid Squad"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs disabled:bg-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Network Category
              </label>
              <select
                disabled={!isVerifiedUser}
                value={category}
                onChange={(e) => setCategory(e.target.value as DonorGroup['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs bg-white disabled:bg-slate-100"
              >
                <option value="Emergency Vanguard">Emergency Vanguard (ER Trauma)</option>
                <option value="Hospital Auxiliary">Hospital Auxiliary Volunteer</option>
                <option value="Rare Blood Network">Rare Blood & Phenotype Alliance</option>
                <option value="Community Lifesavers">Community Lifesavers (Mobile Drives)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mission Description
              </label>
              <textarea
                disabled={!isVerifiedUser}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe call-up schedules, target blood groups, and participating medical centers..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs disabled:bg-slate-100"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isVerifiedUser}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#1F2A6B] hover:bg-[#151c4a] disabled:bg-slate-300 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create & Launch Group</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: AVAILABLE GROUPS TO JOIN */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Available Groups to Join
              </h3>
              <p className="text-xs text-slate-500">
                Active certified networks responding to blood emergencies
              </p>
            </div>

            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {groups.length} Groups Active
            </span>
          </div>

          <div className="space-y-3">
            {groups.map((group) => {
              const isJoined = group.isJoined;

              return (
                <div
                  key={group.id}
                  className={`bg-white rounded-2xl border-2 p-5 transition-all shadow-xs hover:shadow-md ${
                    isJoined
                      ? 'border-[#1F2A6B]/40 bg-slate-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900">{group.name}</h4>
                        <span className="text-[10px] font-semibold text-[#1F2A6B] bg-[#E6E6F2] px-2 py-0.5 rounded-md">
                          {group.category}
                        </span>
                        {group.isVerifiedOnly && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {group.description}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {group.memberCount} Members
                        </span>
                        <span>·</span>
                        <span>Region: {group.location}</span>
                        <span>·</span>
                        <span>Lead: {group.leadCoordinator}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center sm:flex-col justify-end gap-2">
                      <button
                        onClick={() => toggleJoinGroup(group.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          isJoined
                            ? 'bg-emerald-50 hover:bg-rose-50 text-emerald-700 hover:text-rose-700 border border-emerald-300 hover:border-rose-300'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Joined (Member)</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Join Group</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
