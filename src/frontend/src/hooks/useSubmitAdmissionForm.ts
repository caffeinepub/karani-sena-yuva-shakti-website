import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob, Candidate } from '../backend';

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
      
      // Submit the form
      await actor.submitAdmissionForm(fullName, fatherName, dateOfBirth, mobile, lastQualification, address, photo);
      
      // Fetch all candidates to get the newly created admission ID
      const candidates = await actor.getAllCandidates();
      
      // Find the candidate that matches our submission (most recent one with matching details)
      const newCandidate = candidates.find(
        (c: Candidate) => 
          c.fullName === fullName && 
          c.fatherName === fatherName && 
          c.dateOfBirth === dateOfBirth && 
          c.mobile === mobile
      );
      
      if (!newCandidate) {
        throw new Error('Failed to retrieve admission ID');
      }
      
      return newCandidate.admissionID;
    },
    onSuccess: () => {
      // Invalidate candidates query so admin panel updates
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}
