import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Candidate } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useGetAllCandidates() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Candidate[]>({
    queryKey: ['candidates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCandidates();
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}
