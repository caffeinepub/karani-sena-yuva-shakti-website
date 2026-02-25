import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Loader2, AlertCircle, Clock } from 'lucide-react';
import ImageUploadField from '../components/ImageUploadField';
import { useSubmitAdmissionForm, MobileAlreadyRegisteredError } from '../hooks/useSubmitAdmissionForm';
import { ExternalBlob } from '../backend';

// Indian mobile number: exactly 10 digits
const MOBILE_REGEX_10 = /^[0-9]{10}$/;

function isValidMobile(mobile: string): boolean {
  return MOBILE_REGEX_10.test(mobile);
}

interface FieldErrors {
  fullName?: string;
  fatherName?: string;
  dateOfBirth?: string;
  mobile?: string;
  address?: string;
}

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
    isExisting?: boolean;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Refs for auto-focus on first invalid field
  const fullNameRef = useRef<HTMLInputElement>(null);
  const fatherNameRef = useRef<HTMLInputElement>(null);
  const dateOfBirthRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: submitForm, isPending } = useSubmitAdmissionForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user modifies the field
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) setGeneralError(null);
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    let firstInvalidRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

    if (!formData.fullName.trim()) {
      errors.fullName = 'कृपया अपना पूरा नाम दर्ज करें';
      if (!firstInvalidRef) firstInvalidRef = fullNameRef;
    }
    if (!formData.fatherName.trim()) {
      errors.fatherName = 'कृपया पिता का नाम दर्ज करें';
      if (!firstInvalidRef) firstInvalidRef = fatherNameRef;
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'कृपया जन्म तिथि दर्ज करें';
      if (!firstInvalidRef) firstInvalidRef = dateOfBirthRef;
    }
    if (!formData.mobile.trim()) {
      errors.mobile = 'कृपया मोबाइल नंबर दर्ज करें';
      if (!firstInvalidRef) firstInvalidRef = mobileRef;
    } else if (!isValidMobile(formData.mobile.trim())) {
      errors.mobile = 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (जैसे: 9450956184)';
      if (!firstInvalidRef) firstInvalidRef = mobileRef;
    }
    if (!formData.address.trim()) {
      errors.address = 'कृपया अपना पूरा पता दर्ज करें';
      if (!firstInvalidRef) firstInvalidRef = addressRef;
    }

    setFieldErrors(errors);

    if (firstInvalidRef && firstInvalidRef.current) {
      firstInvalidRef.current.focus();
      firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    const mobile = formData.mobile.trim();

    submitForm(
      {
        fullName: formData.fullName.trim(),
        fatherName: formData.fatherName.trim(),
        dateOfBirth: formData.dateOfBirth,
        mobile,
        lastQualification: formData.lastQualification.trim(),
        address: formData.address.trim(),
        photo,
      },
      {
        onSuccess: (admissionID) => {
          setSubmissionData({
            admissionID,
            submittedDate: new Date(),
            isExisting: false,
          });
        },
        onError: (error) => {
          console.error('Admission form submission error:', error);
          if (error instanceof MobileAlreadyRegisteredError) {
            // Show the existing admission card with the backend-returned ID
            setSubmissionData({
              admissionID: error.existingAdmissionID,
              submittedDate: new Date(),
              isExisting: true,
            });
          } else if (error.message === 'invalid_mobile_number') {
            setFieldErrors((prev) => ({
              ...prev,
              mobile: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (जैसे: 9450956184)',
            }));
            if (mobileRef.current) {
              mobileRef.current.focus();
              mobileRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else if (error.message === 'Actor not available') {
            setGeneralError('सेवा अभी उपलब्ध नहीं है। कृपया पेज रिफ्रेश करें और पुनः प्रयास करें।');
          } else {
            setGeneralError('आवेदन जमा करने में विफल: ' + error.message + ' — कृपया पुनः प्रयास करें।');
          }
        },
      }
    );
  };

  const handleNewApplication = () => {
    setSubmissionData(null);
    setFieldErrors({});
    setGeneralError(null);
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
          {submissionData.isExisting ? (
            <Alert className="print:hidden">
              <Info className="h-4 w-4" />
              <AlertDescription>
                यह मोबाइल नंबर पहले से पंजीकृत है। आपका प्रवेश पत्र नीचे दिए गए प्रिंट बटन से प्रिंट करें।
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="print:hidden border-warning/30 bg-warning/10">
              <Clock className="h-4 w-4 text-warning" />
              <AlertDescription>
                <strong>आपका आवेदन सफलतापूर्वक जमा हो गया है!</strong> आपका आवेदन अभी <strong>pending</strong> है। Admin द्वारा approve होने के बाद आपका ID Card जारी किया जाएगा। अपना आवेदन नंबर नोट करें: <strong>{submissionData.admissionID}</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Show a pending notice card instead of the full ID card for new submissions */}
          {!submissionData.isExisting ? (
            <div className="flex justify-center">
              <Card className="w-full max-w-md border-warning/30">
                <CardContent className="py-10 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-warning/10 p-5">
                      <Clock className="h-12 w-12 text-warning" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">आवेदन प्राप्त हुआ</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      आपका आवेदन admin की समीक्षा के लिए भेज दिया गया है।
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">आवेदन संख्या</p>
                    <p className="text-2xl font-bold font-mono text-primary">{submissionData.admissionID}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Admin द्वारा approve होने के बाद आप अपना ID Card <strong>/reprint</strong> पेज से प्रिंट कर सकते हैं।
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            // For existing registrations, show the full admission card for reprinting
            <div className="flex justify-center">
              <Card className="w-full max-w-md">
                <CardContent className="py-10 text-center space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">आवेदन संख्या</p>
                    <p className="text-2xl font-bold font-mono text-primary">{submissionData.admissionID}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    यह नंबर पहले से पंजीकृत है। ID Card reprint के लिए <strong>/reprint</strong> पेज पर जाएं।
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

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
            {generalError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* पूरा नाम */}
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  पूरा नाम <span className="text-destructive">*</span>
                </Label>
                <Input
                  ref={fullNameRef}
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="अपना पूरा नाम दर्ज करें"
                  disabled={isPending}
                  className={fieldErrors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {fieldErrors.fullName && (
                  <p className="text-sm text-destructive font-medium">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* पिता का नाम */}
              <div className="space-y-2">
                <Label htmlFor="fatherName">
                  पिता का नाम <span className="text-destructive">*</span>
                </Label>
                <Input
                  ref={fatherNameRef}
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="अपने पिता का नाम दर्ज करें"
                  disabled={isPending}
                  className={fieldErrors.fatherName ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {fieldErrors.fatherName && (
                  <p className="text-sm text-destructive font-medium">{fieldErrors.fatherName}</p>
                )}
              </div>

              {/* जन्म तिथि */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  जन्म तिथि <span className="text-destructive">*</span>
                </Label>
                <Input
                  ref={dateOfBirthRef}
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={isPending}
                  className={fieldErrors.dateOfBirth ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {fieldErrors.dateOfBirth && (
                  <p className="text-sm text-destructive font-medium">{fieldErrors.dateOfBirth}</p>
                )}
              </div>

              {/* मोबाइल नंबर */}
              <div className="space-y-2">
                <Label htmlFor="mobile">
                  मोबाइल नंबर <span className="text-destructive">*</span>
                </Label>
                <Input
                  ref={mobileRef}
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10 अंकों का मोबाइल नंबर दर्ज करें (जैसे: 9450956184)"
                  disabled={isPending}
                  maxLength={10}
                  className={fieldErrors.mobile ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {fieldErrors.mobile && (
                  <p className="text-sm text-destructive font-medium">{fieldErrors.mobile}</p>
                )}
              </div>

              {/* अंतिम शिक्षा योग्यता */}
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

              {/* पूरा पता */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  पूरा पता <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  ref={addressRef}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="अपना पूरा पता दर्ज करें"
                  rows={4}
                  disabled={isPending}
                  className={fieldErrors.address ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {fieldErrors.address && (
                  <p className="text-sm text-destructive font-medium">{fieldErrors.address}</p>
                )}
              </div>

              {/* फोटो */}
              <ImageUploadField
                label="आपकी फोटो"
                value={photo}
                onChange={setPhoto}
                disabled={isPending}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    जमा हो रहा है...
                  </>
                ) : (
                  'आवेदन जमा करें'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
