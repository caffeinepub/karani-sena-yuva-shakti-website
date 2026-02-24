import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">पहुंच अस्वीकृत</h1>
          <p className="text-muted-foreground">
            आपके पास इस पृष्ठ तक पहुंचने की अनुमति नहीं है। केवल प्रशासक ही इस सामग्री को देख सकते हैं।
          </p>
        </div>
        <Button asChild>
          <Link to="/">होम पर वापस जाएं</Link>
        </Button>
      </div>
    </div>
  );
}
