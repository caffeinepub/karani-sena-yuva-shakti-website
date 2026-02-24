import { useGetAllCandidates } from '../hooks/useGetAllCandidates';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Calendar, MapPin, GraduationCap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function AdminCandidatesList() {
  const { data: candidates, isLoading } = useGetAllCandidates();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-6">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground">No admission applications yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Total Applications: <Badge variant="secondary">{candidates.length}</Badge>
        </h2>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {candidates.map((candidate, index) => (
          <AccordionItem key={index} value={`candidate-${index}`} className="border rounded-lg">
            <Card>
              <AccordionTrigger className="hover:no-underline px-6 py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center space-x-4">
                    {candidate.photo ? (
                      <img
                        src={candidate.photo.getDirectURL()}
                        alt={candidate.fullName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div className="text-left">
                      <h3 className="font-semibold">{candidate.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.mobile}</p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Date of Birth</p>
                        <p className="text-sm text-muted-foreground">{candidate.dateOfBirth}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Mobile</p>
                        <p className="text-sm text-muted-foreground">{candidate.mobile}</p>
                      </div>
                    </div>

                    {candidate.lastQualification && (
                      <div className="flex items-start space-x-3">
                        <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Last Qualification</p>
                          <p className="text-sm text-muted-foreground">{candidate.lastQualification}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3 md:col-span-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.address}</p>
                      </div>
                    </div>
                  </div>

                  {candidate.photo && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Photo</p>
                      <img
                        src={candidate.photo.getDirectURL()}
                        alt={candidate.fullName}
                        className="w-48 h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

