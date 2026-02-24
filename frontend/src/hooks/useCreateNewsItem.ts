import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useCreateNewsItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
      createdAt,
    }: {
      title: string;
      content: string;
      createdAt: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNewsItem(title, content, createdAt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsItems'] });
    },
  });
}

