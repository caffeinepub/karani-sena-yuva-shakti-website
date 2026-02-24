import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useAddGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ image, description }: { image: ExternalBlob; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        return await actor.addGalleryItem(image, description);
      } catch (error: any) {
        // Extract meaningful error message from backend trap
        const errorMessage = error.message || error.toString();
        console.error('Backend error:', errorMessage);
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}
