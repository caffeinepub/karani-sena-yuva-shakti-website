import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NewsItem } from '../backend';

export function useGetAllNewsItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewsItem[]>({
    queryKey: ['newsItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNewsItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

