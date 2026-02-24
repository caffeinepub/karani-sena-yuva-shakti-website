import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import ImageUploadField from '../components/ImageUploadField';
import AdmissionCard from '../components/AdmissionCard';
import { useSubmitAdmissionForm } from '../hooks/useSubmitAdmissionForm';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function AdmissionFormPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    dateOfBirth: '',
    mobile: '',
    lastQualification: '',
    address: '',
  });
  const [photo, setPhoto] = useState<ExternalBlob | null>(null);
  const [submissionData, setSubmissionData] = useState<{
    admissionID: string;
    submittedDate: Date;
  } | null>(null);

  const { mutate: submitForm, isPending } = useSubmitAdmissionForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.fatherName || !formData.dateOfBirth || !formData.mobile || !formData.address) {
      toast.error('कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    submitForm(
      {
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        dateOfBirth: formData.dateOfBirth,
        mobile: formData.mobile,
        lastQualification: formData.lastQualification,
        address: formData.address,
        photo,
      },
      {
        onSuccess: (admissionID) => {
          toast.success('आवेदन सफलतापूर्वक जमा किया गया!');
          setSubmissionData({
            admissionID,
            submittedDate: new Date(),
          });
        },
        onError: (error) => {
          toast.error('आवेदन जमा करने में विफल: ' + error.message);
        },
      }
    );
  };

  const handleNewApplication = () => {
    setSubmissionData(null);
    setFormData({
      fullName: '',
      fatherName: '',
      dateOfBirth: '',
      mobile: '',
      lastQualification: '',
      address: '',
    });
    setPhoto(null);
  };

  if (submissionData) {
    return (
      <div className="container py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <Alert className="print:hidden">
            <Info className="h-4 w-4" />
            <AlertDescription>
              आपका आवेदन सफलतापूर्वक जमा हो गया है। कृपया अपने रिकॉर्ड के लिए इस प्रवेश पत्र को सहेजें या प्रिंट करें।
              आपकी आधिकारिक प्रवेश आईडी प्रशासन द्वारा पुष्टि की जाएगी।
            </AlertDescription>
          </Alert>

          <AdmissionCard
            admissionID={submissionData.admissionID}
            fullName={formData.fullName}
            fatherName={formData.fatherName}
            dateOfBirth={formData.dateOfBirth}
            mobile={formData.mobile}
            photo={photo}
            submittedDate={submissionData.submittedDate}
          />
          <div className="text-center mt-8 print:hidden">
            <Button onClick={handleNewApplication} variant="outline" size="lg">
              नया आवेदन जमा करें
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">प्रवेश फॉर्म</CardTitle>
            <CardDescription>
              करणी सेना युवा शक्ति की सदस्यता के लिए आवेदन करने हेतु नीचे दिया गया फॉर्म भरें
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  पूरा नाम <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="अपना पूरा नाम दर्ज करें"
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherName">
                  पिता का नाम <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="अपने पिता का नाम दर्ज करें"
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  जन्म तिथि <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">
                  मोबाइल नंबर <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="अपना मोबाइल नंबर दर्ज करें"
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastQualification">अंतिम शिक्षा योग्यता</Label>
                <Input
                  id="lastQualification"
                  name="lastQualification"
                  value={formData.lastQualification}
                  onChange={handleChange}
                  placeholder="जैसे: हाई स्कूल, स्नातक"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  पूरा पता <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="अपना पूरा पता दर्ज करें"
                  rows={4}
                  disabled={isPending}
                  required
                />
              </div>

              <ImageUploadField
                label="आपकी फोटो"
                value={photo}
                onChange={setPhoto}
                disabled={isPending}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? 'जमा हो रहा है...' : 'आवेदन जमा करें'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
