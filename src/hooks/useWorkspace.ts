import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Workspace, WorkspaceMemberRole } from '@/types';

export function useWorkspace() {
  return useQuery<Workspace>({
    queryKey: ['workspace', 'me'],
    queryFn: async () => {
      const { data } = await api.get<Workspace>('/workspace/me');
      return data;
    },
    retry: false,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<Workspace>('/workspace', { name });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['workspace', 'me'], data);
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, email, role }: { workspaceId: string; email: string; role?: WorkspaceMemberRole }) => {
      const { data } = await api.post(`/workspace/${workspaceId}/invite`, { email, role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'me'] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, memberId }: { workspaceId: string; memberId: string }) => {
      await api.delete(`/workspace/${workspaceId}/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'me'] });
    },
  });
}
