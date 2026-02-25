import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Candidate } from '../backend';

function normalizeMobile(mobile: string): string {
  // Remove all whitespace
  const trimmed = mobile.trim();
  // Extract only digits
  const digitsOnly = trimmed.replace(/\D/g, '');
  // If exactly 10 digits, use as-is (standard Indian mobile)
  if (digitsOnly.length === 10) return digitsOnly;
  // If 12 digits starting with 91 (country code), strip it
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return digitsOnly.slice(2);
  // If 11 digits starting with 0, strip leading 0
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) return digitsOnly.slice(1);
  // Fallback: return trimmed original
  return trimmed;
}

export function useGetCandidateByMobile() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (mobile: string): Promise<Candidate | null> => {
      if (!actor) throw new Error('Actor not available');
      const normalized = normalizeMobile(mobile);
      try {
        return await actor.getCandidateByMobile(normalized);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        // If the backend traps with an authorization error, surface it distinctly
        if (
          message.includes('Unauthorized') ||
          message.includes('Only admins') ||
          message.includes('unauthorized')
        ) {
          throw new Error('UNAUTHORIZED');
        }
        throw err;
      }
    },
  });
}
