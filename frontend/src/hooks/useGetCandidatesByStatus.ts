import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Candidate, CandidateStatus } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useGetCandidatesByStatus(status: CandidateStatus) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Candidate[]>({
    queryKey: ['candidatesByStatus', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCandidatesByStatus(status);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}
