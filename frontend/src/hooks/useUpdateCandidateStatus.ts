import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CandidateStatus } from '../backend';

export function useUpdateCandidateStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      admissionId,
      newStatus,
    }: {
      admissionId: string;
      newStatus: CandidateStatus;
    }): Promise<boolean> => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCandidateStatus(admissionId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatesByStatus'] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}
