import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Candidate } from '../backend';

function normalizeMobile(mobile: string): string {
  const trimmed = mobile.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length === 10) return digitsOnly;
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return digitsOnly.slice(2);
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) return digitsOnly.slice(1);
  return trimmed;
}

export function useGetCandidateByMobile() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (mobile: string): Promise<Candidate | null> => {
      if (!actor) throw new Error('Actor not available');
      const normalized = normalizeMobile(mobile);
      // getCandidateByMobile is a public query endpoint — returns null when not found, no auth needed
      const result = await actor.getCandidateByMobile(normalized);
      return result ?? null;
    },
  });
}
