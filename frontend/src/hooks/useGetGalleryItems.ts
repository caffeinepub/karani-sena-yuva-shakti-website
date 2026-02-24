import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { GalleryItem } from '../backend';

export function useGetGalleryItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

