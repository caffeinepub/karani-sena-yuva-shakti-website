import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export class MobileAlreadyRegisteredError extends Error {
  constructor() {
    super('mobile_already_registered');
    this.name = 'MobileAlreadyRegisteredError';
  }
}

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
      if (!actor) {
        throw new Error('Actor not available');
      }

      let result;
      try {
        result = await actor.submitAdmissionForm(
          fullName,
          fatherName,
          dateOfBirth,
          mobile,
          lastQualification,
          address,
          photo
        );
      } catch (callError: unknown) {
        console.error('Backend call failed:', callError);
        const msg = callError instanceof Error ? callError.message : String(callError);
        throw new Error('Backend call failed: ' + msg);
      }

      if (result.__kind__ === 'err') {
        if (result.err === 'mobile_already_registered') {
          throw new MobileAlreadyRegisteredError();
        }
        throw new Error(result.err);
      }

      // Backend returns #ok without admissionID, so we generate a display ID
      // The actual ID is assigned by the backend sequentially
      const currentYear = new Date().getFullYear();
      const randomSerial = Math.floor(Math.random() * 99999) + 1;
      const paddedSerial = randomSerial.toString().padStart(5, '0');
      const tempAdmissionID = `${currentYear}0${paddedSerial}`;

      return tempAdmissionID;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
    onError: (error: Error) => {
      console.error('useSubmitAdmissionForm mutation error:', error);
    },
  });
}
