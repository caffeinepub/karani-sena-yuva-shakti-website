import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, AlertCircle, Info } from 'lucide-react';
import AdmissionCard from '../components/AdmissionCard';
import { useGetCandidateByMobile } from '../hooks/useGetCandidateByMobile';
import { Candidate, ExternalBlob } from '../backend';

export default function ReprintIdCardPage() {
  const [mobile, setMobile] = useState('');
  const [foundCandidate, setFoundCandidate] = useState<Candidate | null | undefined>(undefined);

  const { mutate: searchCandidate, isPending } = useGetCandidateByMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) return;

    searchCandidate(mobile.trim(), {
      onSuccess: (candidate) => {
        setFoundCandidate(candidate);
      },
      onError: () => {
        setFoundCandidate(null);
      },
    });
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value);
    // Reset result when user changes input
    if (foundCandidate !== undefined) {
      setFoundCandidate(undefined);
    }
  };

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/ksys-logo.dim_400x400.png"
              alt="करणी सेना युवा शक्ति"
              className="h-16 w-16"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary">ID कार्ड पुनः प्रिंट करें</h1>
          <p className="text-muted-foreground">
            अपना पंजीकृत मोबाइल नंबर दर्ज करें और अपना प्रवेश पत्र पुनः प्राप्त करें
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">मोबाइल नंबर से खोजें</CardTitle>
            <CardDescription>
              आवेदन के समय दर्ज किया गया मोबाइल नंबर दर्ज करें
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">अपना मोबाइल नंबर दर्ज करें</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={handleMobileChange}
                  placeholder="जैसे: 03001234567"
                  disabled={isPending}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isPending || !mobile.trim()}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    खोज रहे हैं...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    खोजें
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Not Found Message */}
        {foundCandidate === null && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              इस मोबाइल नंबर से कोई प्रवेश नहीं मिला।
            </AlertDescription>
          </Alert>
        )}

        {/* Found Candidate - Show ID Card */}
        {foundCandidate && (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                आपका प्रवेश पत्र मिल गया। कृपया नीचे दिए गए प्रिंट बटन से इसे प्रिंट करें।
              </AlertDescription>
            </Alert>

            <AdmissionCard
              admissionID={foundCandidate.admissionID}
              fullName={foundCandidate.fullName}
              fatherName={foundCandidate.fatherName}
              dateOfBirth={foundCandidate.dateOfBirth}
              mobile={foundCandidate.mobile}
              photo={foundCandidate.photo ?? null}
              submittedDate={new Date(Number(foundCandidate.createdAt) || Date.now())}
            />
          </div>
        )}
      </div>
    </div>
  );
}
