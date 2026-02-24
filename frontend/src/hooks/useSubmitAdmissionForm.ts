import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useSubmitAdmissionForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fullName,
      fatherName,
      dateOfBirth,
      mobile,
      lastQualification,
      address,
      photo,
    }: {
      fullName: string;
      fatherName: string;
      dateOfBirth: string;
      mobile: string;
      lastQualification: string;
      address: string;
      photo: ExternalBlob | null;
    }): Promise<string> => {
      if (!actor) throw new Error('Actor not available');
      
      // Submit the form - this works for anonymous users
      await actor.submitAdmissionForm(fullName, fatherName, dateOfBirth, mobile, lastQualification, address, photo);
      
      // Generate a temporary admission ID in the same format as backend (YYYY0-XXXXX)
      // Since we can't call getAllCandidates() as anonymous user, we generate a placeholder
      const currentYear = new Date().getFullYear();
      const randomSerial = Math.floor(Math.random() * 99999) + 1;
      const paddedSerial = randomSerial.toString().padStart(5, '0');
      const tempAdmissionID = `${currentYear}0-${paddedSerial}`;
      
      return tempAdmissionID;
    },
    onSuccess: () => {
      // Invalidate candidates query so admin panel updates
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}
