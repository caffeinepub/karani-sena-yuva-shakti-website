import { useRef } from 'react';
import { Button } from '@/components/ui/button';
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = submittedDate.toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Success message - hidden on print */}
      <div className="print:hidden text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">
          🎉 आवेदन सफलतापूर्वक जमा हो गया!
        </h2>
        <p className="text-muted-foreground text-sm">
          आपका प्रवेश पत्र तैयार है। कृपया इसे प्रिंट करें या सहेजें।
        </p>
      </div>

      {/* ID Card Container - centered */}
      <div className="flex justify-center">
        {/* 
          Physical ID card: 85.6mm × 54mm (ISO/IEC 7810 ID-1)
          Aspect ratio: 85.6/54 ≈ 1.586
          We render at 2× scale for screen clarity: 342px × 216px
          For print we use exact mm dimensions via @media print
        */}
        <div
          ref={cardRef}
          id="admission-id-card"
          className="id-card relative overflow-hidden"
          style={{
            width: '342px',
            height: '216px',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(180, 80, 0, 0.25), 0 2px 8px rgba(0,0,0,0.15)',
            fontFamily: 'inherit',
          }}
        >
          {/* Card background gradient - saffron/gold theme */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #b45309 0%, #d97706 40%, #f59e0b 70%, #fbbf24 100%)',
            }}
          />

          {/* Decorative pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
              backgroundSize: '8px 8px',
            }}
          />

          {/* Deep red top stripe */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{ height: '38px', background: 'rgba(120, 20, 10, 0.92)' }}
          />

          {/* Card content */}
          <div className="absolute inset-0 flex flex-col" style={{ padding: '0' }}>
            {/* Header strip */}
            <div
              className="flex items-center gap-2 px-3"
              style={{ height: '38px', zIndex: 1 }}
            >
              {/* Logo */}
              <img
                src="/assets/generated/logo-emblem.dim_512x512.png"
                alt="करणी सेना युवा शक्ति"
                style={{ width: '26px', height: '26px', objectFit: 'contain', flexShrink: 0 }}
              />
              {/* Org name */}
              <div className="flex flex-col leading-tight">
                <span
                  style={{
                    color: '#fde68a',
                    fontWeight: 800,
                    fontSize: '9px',
                    letterSpacing: '0.03em',
                    lineHeight: 1.2,
                  }}
                >
                  करणी सेना युवा शक्ति
                </span>
                <span
                  style={{
                    color: '#fcd34d',
                    fontWeight: 500,
                    fontSize: '7px',
                    letterSpacing: '0.05em',
                    lineHeight: 1.2,
                  }}
                >
                  KARNI SENA YUVA SHAKTI
                </span>
              </div>
              {/* Spacer */}
              <div className="flex-1" />
              {/* Card label */}
              <span
                style={{
                  color: '#fde68a',
                  fontWeight: 700,
                  fontSize: '7.5px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                प्रवेश पत्र
              </span>
            </div>

            {/* Body */}
            <div
              className="flex flex-1"
              style={{ padding: '6px 10px 6px 10px', gap: '8px', zIndex: 1 }}
            >
              {/* Photo column */}
              <div className="flex flex-col items-center" style={{ width: '52px', flexShrink: 0 }}>
                {photo ? (
                  <img
                    src={photo.getDirectURL()}
                    alt={fullName}
                    style={{
                      width: '52px',
                      height: '62px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '2px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '52px',
                      height: '62px',
                      borderRadius: '4px',
                      border: '2px solid rgba(255,255,255,0.8)',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <User style={{ width: '28px', height: '28px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                )}
              </div>

              {/* Details column */}
              <div className="flex flex-col flex-1 justify-between" style={{ gap: '3px' }}>
                {/* Admission ID - prominent */}
                <div
                  style={{
                    background: 'rgba(120, 20, 10, 0.85)',
                    borderRadius: '4px',
                    padding: '3px 7px',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginBottom: '2px',
                  }}
                >
                  <span
                    style={{
                      color: '#fcd34d',
                      fontSize: '6px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      lineHeight: 1.2,
                    }}
                  >
                    प्रवेश आईडी
                  </span>
                  <span
                    style={{
                      color: '#fde68a',
                      fontSize: '13px',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      lineHeight: 1.2,
                    }}
                  >
                    {admissionID}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <div
                    style={{
                      color: 'rgba(120, 20, 10, 0.9)',
                      fontSize: '6px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      lineHeight: 1,
                    }}
                  >
                    नाम
                  </div>
                  <div
                    style={{
                      color: '#1c0a00',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px',
                    }}
                  >
                    {fullName}
                  </div>
                </div>

                {/* Father's name */}
                <div>
                  <div
                    style={{
                      color: 'rgba(120, 20, 10, 0.9)',
                      fontSize: '6px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      lineHeight: 1,
                    }}
                  >
                    पिता का नाम
                  </div>
                  <div
                    style={{
                      color: '#1c0a00',
                      fontSize: '9px',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px',
                    }}
                  >
                    {fatherName}
                  </div>
                </div>

                {/* DOB and Mobile in a row */}
                <div className="flex gap-4">
                  <div>
                    <div
                      style={{
                        color: 'rgba(120, 20, 10, 0.9)',
                        fontSize: '6px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        lineHeight: 1,
                      }}
                    >
                      जन्म तिथि
                    </div>
                    <div
                      style={{
                        color: '#1c0a00',
                        fontSize: '8.5px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {dateOfBirth}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(120, 20, 10, 0.9)',
                        fontSize: '6px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        lineHeight: 1,
                      }}
                    >
                      मोबाइल नंबर
                    </div>
                    <div
                      style={{
                        color: '#1c0a00',
                        fontSize: '8.5px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {mobile}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer strip */}
            <div
              style={{
                background: 'rgba(120, 20, 10, 0.85)',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px',
                zIndex: 1,
              }}
            >
              <span
                style={{
                  color: '#fde68a',
                  fontSize: '6px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                जारी तिथि: {formattedDate}
              </span>
              <span
                style={{
                  color: '#fcd34d',
                  fontSize: '6px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                ★ करणी सेना युवा शक्ति ★
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Print button - hidden on print */}
      <div className="print:hidden flex justify-center gap-4">
        <Button onClick={handlePrint} size="lg" className="gap-2">
          <Printer className="h-5 w-5" />
          प्रिंट करें
        </Button>
      </div>
    </div>
  );
}
