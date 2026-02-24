import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import GallerySection from '../components/GallerySection';
import NewsSection from '../components/NewsSection';

export default function HomePage() {
  const scrollToNews = () => {
    const newsSection = document.getElementById('news');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x600.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6 animate-fade-in">
            <div className="flex items-center space-x-4">
              <img
                src="/assets/generated/logo-emblem.dim_512x512.png"
                alt="करणी सेना युवा शक्ति Logo"
                className="h-24 w-24 md:h-32 md:w-32 drop-shadow-lg object-contain"
              />
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                  करणी सेना युवा शक्ति
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-2">
                  Empowering Youth, Building Tomorrow
                </p>
              </div>
            </div>
            <p className="text-lg text-foreground/90 max-w-2xl">
              Join us in our mission to empower young minds and build a stronger community. Together, we create
              opportunities for growth, leadership, and positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="shadow-warm">
                <Link to="/admission">
                  Apply for Admission <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToNews}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* News Section */}
      <NewsSection />
    </div>
  );
}
