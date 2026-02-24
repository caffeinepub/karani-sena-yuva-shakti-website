import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalBlob } from '../backend';
import { Printer, User } from 'lucide-react';

interface AdmissionCardProps {
  admissionID: string;
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  mobile: string;
  photo: ExternalBlob | null;
  submittedDate: Date;
}

export default function AdmissionCard({
  admissionID,
  fullName,
  fatherName,
  dateOfBirth,
  mobile,
  photo,
  submittedDate,
}: AdmissionCardProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="print:hidden text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Application Submitted Successfully!</h2>
        <p className="text-muted-foreground">
          Your admission card is ready. Please save or print this card for your records.
        </p>
        <Button onClick={handlePrint} size="lg" className="gap-2">
          <Printer className="h-5 w-5" />
          Print Admission Card
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto border-2 border-primary/20 shadow-warm-lg print:shadow-none print:border-2 print:border-black">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-primary/20 pb-6 print:border-black">
            <h1 className="text-3xl font-bold text-primary print:text-black">
              Karani Sena Yuva Shakti
            </h1>
            <p className="text-lg font-semibold mt-2">Admission Card</p>
          </div>

          {/* Admission ID - Prominent Display */}
          <div className="bg-primary/5 border-2 border-primary rounded-lg p-4 text-center print:bg-gray-100 print:border-black">
            <p className="text-sm font-medium text-muted-foreground print:text-gray-600">
              Reference ID
            </p>
            <p className="text-3xl font-bold text-primary tracking-wider mt-1 print:text-black">
              {admissionID}
            </p>
          </div>

          {/* Photo and Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
            {/* Photo */}
            <div className="flex justify-center md:justify-start">
              {photo ? (
                <img
                  src={photo.getDirectURL()}
                  alt={fullName}
                  className="w-32 h-32 object-cover rounded-lg border-2 border-primary/20 print:border-black"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg border-2 border-primary/20 bg-primary/5 flex items-center justify-center print:bg-gray-100 print:border-black">
                  <User className="h-16 w-16 text-primary/40 print:text-gray-400" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground print:text-gray-600">
                  Full Name
                </p>
                <p className="text-lg font-semibold">{fullName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground print:text-gray-600">
                  Father's Name
                </p>
                <p className="text-lg font-semibold">{fatherName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground print:text-gray-600">
                    Date of Birth
                  </p>
                  <p className="font-semibold">{dateOfBirth}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground print:text-gray-600">
                    Mobile Number
                  </p>
                  <p className="font-semibold">{mobile}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-primary/20 pt-6 text-center print:border-black">
            <p className="text-sm text-muted-foreground print:text-gray-600">
              Submitted on: {submittedDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-2 print:text-gray-500">
              Please keep this card safe for future reference
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="print:hidden text-center">
        <Button onClick={handlePrint} variant="outline" size="lg" className="gap-2">
          <Printer className="h-5 w-5" />
          Print Card
        </Button>
      </div>
    </div>
  );
}
