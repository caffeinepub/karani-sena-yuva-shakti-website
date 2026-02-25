import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllCandidates } from '../hooks/useGetAllCandidates';
import AdmissionCard from '../components/AdmissionCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AdminPrintCardPage() {
  const { admissionId } = useParams({ from: '/admin/print-card/$admissionId' });
  const navigate = useNavigate();
  const { data: candidates, isLoading } = useGetAllCandidates();

  const candidate = candidates?.find((c) => c.admissionID === admissionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container py-16 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>
            Candidate with ID <strong>{admissionId}</strong> not found.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => navigate({ to: '/admin' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Admin Panel पर वापस जाएं
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Banner - hidden on print */}
        <Alert className="print:hidden border-success/30 bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            <strong>{candidate.fullName}</strong> का आवेदन सफलतापूर्वक approve हो गया है! नीचे दिए गए ID Card को प्रिंट करें।
          </AlertDescription>
        </Alert>

        {/* Back button - hidden on print */}
        <div className="print:hidden">
          <Button variant="outline" size="sm" onClick={() => navigate({ to: '/admin' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Admin Panel पर वापस जाएं
          </Button>
        </div>

        {/* Admission Card */}
        <AdmissionCard
          admissionID={candidate.admissionID}
          fullName={candidate.fullName}
          fatherName={candidate.fatherName}
          dateOfBirth={candidate.dateOfBirth}
          mobile={candidate.mobile}
          photo={candidate.photo ?? null}
          submittedDate={new Date(Number(candidate.createdAt) / 1_000_000)}
        />
      </div>
    </div>
  );
}
