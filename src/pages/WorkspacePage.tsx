import { useState } from 'react';
import { Users, Plus, Trash2, Crown, Shield, User as UserIcon, Loader2, Mail } from 'lucide-react';
import { useWorkspace, useCreateWorkspace, useInviteMember, useRemoveMember } from '@/hooks/useWorkspace';
import { useToast } from '@/providers/ToastProvider';
import { useAppStore } from '@/store/useAppStore';
import { WorkspaceMemberRole } from '@/types';

const roleIcon = (role: WorkspaceMemberRole) => {
  if (role === 'OWNER') return <Crown className="w-3.5 h-3.5 text-yellow-400" />;
  if (role === 'ADMIN') return <Shield className="w-3.5 h-3.5 text-blue-400" />;
  return <UserIcon className="w-3.5 h-3.5 text-gray-400" />;
};

const roleLabel = (role: WorkspaceMemberRole) => {
  if (role === 'OWNER') return 'Owner';
  if (role === 'ADMIN') return 'Admin';
  return 'Member';
};

export default function WorkspacePage() {
  const { success, error } = useToast();
  const { user } = useAppStore();

  const { data: workspace, isLoading } = useWorkspace();
  const createWorkspace = useCreateWorkspace();
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();

  const [workspaceName, setWorkspaceName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceMemberRole>('MEMBER');

  const handleCreate = async () => {
    if (!workspaceName.trim()) return;
    try {
      await createWorkspace.mutateAsync(workspaceName.trim());
      success('Workspace created!');
      setWorkspaceName('');
    } catch {
      error('Failed to create workspace.');
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !workspace) return;
    try {
      await inviteMember.mutateAsync({ workspaceId: workspace.id, email: inviteEmail.trim(), role: inviteRole });
      success(`Invite sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch {
      error('Failed to send invite.');
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!workspace) return;
    if (!confirm('Remove this member from the workspace?')) return;
    try {
      await removeMember.mutateAsync({ workspaceId: workspace.id, memberId });
      success('Member removed.');
    } catch {
      error('Failed to remove member.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  // No workspace yet — show creation form
  if (!workspace) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Team Workspace</h1>
          <p className="text-gray-400 text-sm mt-1">Collaborate with your team on subscription management.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold">Create a workspace</p>
              <p className="text-xs text-gray-400">Invite up to 5 teammates</p>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Workspace name</label>
            <input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="e.g. Acme Corp"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!workspaceName.trim() || createWorkspace.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
          >
            {createWorkspace.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Workspace
          </button>
        </div>

        <p className="text-xs text-center text-gray-600">
          Team workspace is available on the <span className="text-purple-400 font-medium">Team plan ($9.99/mo)</span>.
        </p>
      </div>
    );
  }

  const isOwner = workspace.ownerId === user?.id;
  const activeMembers = workspace.members.filter((m) => m.status === 'ACTIVE');
  const pendingMembers = workspace.members.filter((m) => m.status === 'PENDING');

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Team Workspace</h1>
        <p className="text-gray-400 text-sm mt-1">{workspace.name}</p>
      </div>

      {/* Workspace stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold">{activeMembers.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Active</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold">{pendingMembers.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Pending</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold">{workspace.maxMembers}</p>
          <p className="text-xs text-gray-400 mt-0.5">Max seats</p>
        </div>
      </div>

      {/* Invite member */}
      {isOwner && activeMembers.length < workspace.maxMembers && (
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Plus className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm">Invite a teammate</h3>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                placeholder="colleague@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as WorkspaceMemberRole)}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            onClick={handleInvite}
            disabled={!inviteEmail.trim() || inviteMember.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
          >
            {inviteMember.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Send Invite
          </button>
        </div>
      )}

      {/* Active members */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-sm">Members</h3>
          <span className="ml-auto text-xs text-gray-500">{activeMembers.length}/{workspace.maxMembers}</span>
        </div>
        <div className="space-y-2">
          {activeMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/4 transition-all group">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-300">
                  {(member.user?.name || member.inviteEmail || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.user?.name || member.inviteEmail || 'Unknown'}</p>
                <p className="text-xs text-gray-500 truncate">{member.user?.email || member.inviteEmail}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                {roleIcon(member.role)}
                <span>{roleLabel(member.role)}</span>
              </div>
              {isOwner && member.role !== 'OWNER' && (
                <button
                  onClick={() => handleRemove(member.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending invites */}
      {pendingMembers.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-sm">Pending Invites</h3>
          </div>
          <div className="space-y-2">
            {pendingMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/4 transition-all group">
                <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.inviteEmail}</p>
                  <p className="text-xs text-yellow-500/70">Invite pending</p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
