import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUploadField from '../components/ImageUploadField';
import { useSubmitAdmissionForm } from '../hooks/useSubmitAdmissionForm';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

export default function AdmissionFormPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    mobile: '',
    lastQualification: '',
    address: '',
  });
  const [photo, setPhoto] = useState<ExternalBlob | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitForm, isPending } = useSubmitAdmissionForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.dateOfBirth || !formData.mobile || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    submitForm(
      {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        mobile: formData.mobile,
        lastQualification: formData.lastQualification,
        address: formData.address,
        photo,
      },
      {
        onSuccess: () => {
          toast.success('Application submitted successfully!');
          setSubmitted(true);
          setFormData({
            fullName: '',
            dateOfBirth: '',
            mobile: '',
            lastQualification: '',
            address: '',
          });
          setPhoto(null);
        },
        onError: (error) => {
          toast.error('Failed to submit application: ' + error.message);
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Application Submitted!</h1>
          <p className="text-muted-foreground">
            Thank you for your interest in Karani Sena Yuva Shakti. We have received your application and will
            review it shortly.
          </p>
          <Button onClick={() => setSubmitted(false)}>Submit Another Application</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Admission Form</CardTitle>
            <CardDescription>
              Fill out the form below to apply for membership in Karani Sena Yuva Shakti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-destructive">*</span>
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
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastQualification">Last Qualification</Label>
                <Input
                  id="lastQualification"
                  name="lastQualification"
                  value={formData.lastQualification}
                  onChange={handleChange}
                  placeholder="e.g., High School, Bachelor's Degree"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Complete Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={4}
                  disabled={isPending}
                  required
                />
              </div>

              <ImageUploadField
                label="Your Photo"
                value={photo}
                onChange={setPhoto}
                disabled={isPending}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

