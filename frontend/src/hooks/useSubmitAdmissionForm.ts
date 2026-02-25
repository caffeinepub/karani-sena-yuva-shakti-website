import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export class MobileAlreadyRegisteredError extends Error {
  existingAdmissionID: string;
  constructor(existingAdmissionID: string) {
    super('mobile_already_registered');
    this.name = 'MobileAlreadyRegisteredError';
    this.existingAdmissionID = existingAdmissionID;
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
        if (result.err.__kind__ === 'mobileAlreadyRegistered') {
          throw new MobileAlreadyRegisteredError(result.err.mobileAlreadyRegistered);
        }
        if (result.err.__kind__ === 'invalidMobileNumber') {
          throw new Error('invalid_mobile_number');
        }
        throw new Error('Unknown error');
      }

      // Return the admission ID directly from the backend
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
    onError: (error: Error) => {
      console.error('useSubmitAdmissionForm mutation error:', error);
    },
  });
}
