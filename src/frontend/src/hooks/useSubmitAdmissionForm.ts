import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useSubmitAdmissionForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      fullName,
      dateOfBirth,
      mobile,
      lastQualification,
      address,
      photo,
    }: {
      fullName: string;
      dateOfBirth: string;
      mobile: string;
      lastQualification: string;
      address: string;
      photo: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAdmissionForm(fullName, dateOfBirth, mobile, lastQualification, address, photo);
    },
  });
}

