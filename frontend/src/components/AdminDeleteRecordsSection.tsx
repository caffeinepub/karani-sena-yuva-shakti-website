import { useState } from 'react';
import { useGetAllCandidates } from '../hooks/useGetAllCandidates';
import { useDeleteCandidate } from '../hooks/useDeleteCandidate';
import { Candidate } from '../backend';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function AdminDeleteRecordsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);

  const { data: candidates, isLoading, isError } = useGetAllCandidates();
  const { mutate: deleteCandidate, isPending: isDeleting } = useDeleteCandidate();

  const filteredCandidates = (candidates ?? []).filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.admissionID.toLowerCase().includes(q)
    );
  });

  const handleDeleteConfirm = () => {
    if (!candidateToDelete) return;
    const name = candidateToDelete.fullName;
    const id = candidateToDelete.admissionID;
    deleteCandidate(id, {
      onSuccess: (deleted) => {
        if (deleted) {
          toast.success(`"${name}" का record सफलतापूर्वक delete हो गया।`);
        } else {
          toast.error('Record नहीं मिला। शायद पहले ही delete हो चुका है।');
        }
        setCandidateToDelete(null);
      },
      onError: () => {
        toast.error('Delete करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        setCandidateToDelete(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Records Delete करें</h2>
        <p className="text-muted-foreground mt-1">
          किसी भी candidate का record permanently delete करें।
        </p>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="नाम, मोबाइल नंबर या Admission ID से खोजें..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Error State */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Records load करने में त्रुटि हुई। कृपया पुनः प्रयास करें।
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="text-sm text-muted-foreground">
            कुल {filteredCandidates.length} record{filteredCandidates.length !== 1 ? 's' : ''} मिले
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission ID</TableHead>
                  <TableHead>नाम</TableHead>
                  <TableHead>पिता का नाम</TableHead>
                  <TableHead>मोबाइल</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      {searchQuery ? 'कोई record नहीं मिला।' : 'अभी तक कोई record नहीं है।'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.admissionID}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {candidate.admissionID}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{candidate.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{candidate.fatherName}</TableCell>
                      <TableCell className="font-mono">{candidate.mobile}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setCandidateToDelete(candidate)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!candidateToDelete}
        onOpenChange={(open) => {
          if (!open) setCandidateToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record Delete करें?</AlertDialogTitle>
            <AlertDialogDescription>
              क्या आप सच में यह record delete करना चाहते हैं?
              {candidateToDelete && (
                <span className="block mt-2 font-semibold text-foreground">
                  {candidateToDelete.fullName} ({candidateToDelete.admissionID})
                </span>
              )}
              <span className="block mt-1 text-destructive font-medium">
                यह action permanent है और इसे undo नहीं किया जा सकता।
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Delete हो रहा है...
                </span>
              ) : (
                'हाँ, Delete करें'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
