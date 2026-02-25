import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Candidate } from '../backend';

export function useGetCandidateByMobile() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (mobile: string): Promise<Candidate | null> => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCandidateByMobile(mobile);
    },
  });
}
