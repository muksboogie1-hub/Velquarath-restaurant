import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import {
  AdminMember,
  fetchAdminTeam,
  createAdminMember,
  toggleAdminStatus,
  deleteAdminMember,
} from '../services/authService';

export const StaffManager: React.FC = () => {
  const { currentUser } = useContent();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'manager'>('admin');
  const [creating, setCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTeam();
      setMembers(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setStatusMsg(null);

    const res = await createAdminMember(newEmail, newPassword, newRole);
    setCreating(false);

    if (res.success && res.member) {
      setStatusMsg({
        type: 'success',
        text: `Administrator account for ${res.member.email} created and authorized successfully!`,
      });
      setModalOpen(false);
      setNewEmail('');
      setNewPassword('');
      loadTeam();
    } else {
      setStatusMsg({
        type: 'error',
        text: res.error || 'Failed to create administrator account.',
      });
    }
  };

  const handleToggle = async (member: AdminMember) => {
    if (member.role === 'owner') return; // Cannot deactivate primary owner
    const nextStatus = !member.isActive;
    const res = await toggleAdminStatus(member.id, nextStatus);
    if (res.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, isActive: nextStatus } : m))
      );
    } else {
      setStatusMsg({
        type: 'error',
        text: res.error || 'Could not update administrator status.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAdminMember(id);
    if (res.success) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setDeleteConfirmId(null);
      setStatusMsg({
        type: 'success',
        text: 'Administrator access revoked successfully.',
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: res.error || 'Could not revoke administrator access.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#332E26]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">
            Staff &amp; Administrators
          </h2>
          <p className="text-xs text-[#B8AD96] mt-1">
            Manage authorized administrative users. Only accounts listed here can modify menu items, prices, reservations, and restaurant content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadTeam}
            className="p-2 rounded-lg bg-[#1E1B17] hover:bg-[#26221D] text-[#B8AD96] hover:text-[#F4ECDA] border border-[#332E26] cursor-pointer"
            title="Refresh team"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors shadow-lg cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-700 text-emerald-200'
              : 'bg-red-950/60 border border-red-700 text-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Security Architecture Notice */}
      <div className="p-4 rounded-xl bg-[#1E1B17] border border-[#332E26] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" />
        <div className="text-xs text-[#B8AD96] leading-relaxed space-y-1">
          <p className="font-semibold text-[#F4ECDA]">
            Zero-Trust Access Control (RLS-Enforced)
          </p>
          <p>
            Public sign-up is completely disabled on the live website. Every mutation to the database (dishes, prices, opening hours, reservations, and media files) is validated at the PostgreSQL level against the <code className="font-mono text-[#C9A24B]">public.admin_users</code> whitelist table using the user&apos;s cryptographic JWT ID.
          </p>
        </div>
      </div>

      {/* Admin Members List */}
      <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#F4ECDA]">
            <thead className="bg-[#141210] border-b border-[#332E26] text-[#B8AD96] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Added On</th>
                <th className="py-3 px-4 text-center">Access Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#332E26]">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#B8AD96]">
                    No administrators found.
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const isCurrent = currentUser?.email?.toLowerCase() === member.email?.toLowerCase();
                  return (
                    <tr key={member.id} className="hover:bg-[#26221D]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#26221D] border border-[#332E26] flex items-center justify-center text-[#C9A24B] font-semibold text-xs shrink-0">
                            {member.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#F4ECDA]">
                                {member.email}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/40 font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#736B5E] font-mono">
                              ID: {member.userId ? member.userId.slice(0, 8) + '...' : 'Pre-seeded'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                            member.role === 'owner'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-700'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#B8AD96] whitespace-nowrap font-mono">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString()
                          : 'System Seed'}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggle(member)}
                          disabled={member.role === 'owner'}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            member.role === 'owner'
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 cursor-default'
                              : member.isActive
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/80 cursor-pointer'
                              : 'bg-red-950/70 text-red-300 border border-red-700/60 hover:bg-red-900/80 cursor-pointer'
                          }`}
                          title={member.role === 'owner' ? 'Primary owner cannot be deactivated' : 'Click to toggle access'}
                        >
                          {member.isActive ? '● Active' : '○ Suspended'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {member.role !== 'owner' && !isCurrent ? (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(member.id)}
                            className="p-1.5 rounded-lg bg-[#26221D] hover:bg-red-950/60 text-[#B8AD96] hover:text-red-400 transition-colors cursor-pointer"
                            title="Revoke Administrator Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#736B5E] italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ADMIN MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#332E26] mb-5">
              <div className="flex items-center gap-2 text-[#C9A24B]">
                <KeyRound className="w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-[#F4ECDA]">
                  Add Authorized Administrator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#B8AD96] hover:text-[#F4ECDA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                  Administrator Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#B8AD96] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="manager@velquarath.com"
                    className="w-full bg-[#141210] border border-[#332E26] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                  Initial Password (min. 6 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#B8AD96] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Set temporary secure password"
                    className="w-full bg-[#141210] border border-[#332E26] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-[#736B5E] mt-1">
                  The user can use this password to sign in immediately on the admin portal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                  Administrative Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'manager')}
                  className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="manager">Manager (Menu &amp; Reservations)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#332E26]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#B8AD96] bg-[#26221D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {creating ? 'Creating Account...' : 'Create & Authorize Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVOKE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1E1B17] border border-red-900/60 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-display text-lg font-bold text-[#F4ECDA]">
                Revoke Admin Privileges
              </h3>
            </div>
            <p className="text-xs text-[#B8AD96] leading-relaxed">
              Are you sure you want to remove this user from the administrator whitelist? Their database permissions and login access will be revoked immediately.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#B8AD96] hover:text-[#F4ECDA] bg-[#26221D] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Yes, Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
