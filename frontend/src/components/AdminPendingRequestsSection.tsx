import { useNavigate } from '@tanstack/react-router';
import { useGetCandidatesByStatus } from '../hooks/useGetCandidatesByStatus';
import { useUpdateCandidateStatus } from '../hooks/useUpdateCandidateStatus';
import { CandidateStatus, Candidate } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, CheckCircle, XCircle, Clock, Phone, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminPendingRequestsSection() {
  const { data: pendingCandidates, isLoading } = useGetCandidatesByStatus(CandidateStatus.pending);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateCandidateStatus();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (candidate: Candidate) => {
    setProcessingId(candidate.admissionID);
    updateStatus(
      { admissionId: candidate.admissionID, newStatus: CandidateStatus.approved },
      {
        onSuccess: () => {
          setProcessingId(null);
          navigate({ to: '/admin/print-card/$admissionId', params: { admissionId: candidate.admissionID } });
        },
        onError: () => {
          setProcessingId(null);
        },
      }
    );
  };

  const handleReject = (candidate: Candidate) => {
    setProcessingId(candidate.admissionID);
    updateStatus(
      { admissionId: candidate.admissionID, newStatus: CandidateStatus.rejected },
      {
        onSuccess: () => {
          setProcessingId(null);
        },
        onError: () => {
          setProcessingId(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Pending Requests</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!pendingCandidates || pendingCandidates.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Pending Requests</h2>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-6">
                <CheckCircle className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground text-lg font-medium">कोई pending request नहीं है</p>
            <p className="text-muted-foreground text-sm mt-1">सभी आवेदन process हो चुके हैं।</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Pending Requests</h2>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {pendingCandidates.length} pending
        </Badge>
      </div>

      <div className="space-y-3">
        {pendingCandidates.map((candidate) => {
          const isProcessing = processingId === candidate.admissionID && isUpdating;
          return (
            <Card key={candidate.admissionID} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    {candidate.photo ? (
                      <img
                        src={candidate.photo.getDirectURL()}
                        alt={candidate.fullName}
                        className="h-14 w-14 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <User className="h-7 w-7 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {candidate.admissionID}
                      </Badge>
                      <Badge className="text-xs bg-warning/20 text-warning-foreground border-warning/30">
                        Pending
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-base truncate">{candidate.fullName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <UserCircle className="h-3.5 w-3.5" />
                        <span className="truncate">{candidate.fatherName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{candidate.mobile}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(candidate)}
                      disabled={isProcessing || isUpdating}
                      className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">हाँ (Approve)</span>
                      <span className="sm:hidden">हाँ</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(candidate)}
                      disabled={isProcessing || isUpdating}
                      className="gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">नहीं (Reject)</span>
                      <span className="sm:hidden">नहीं</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
