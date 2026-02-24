import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useDeleteNewsItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNewsItem(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsItems'] });
    },
  });
}

