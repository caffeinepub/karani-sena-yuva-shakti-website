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
                  युवाओं को सशक्त बनाना, कल का निर्माण करना
                </p>
              </div>
            </div>
            <p className="text-lg text-foreground/90 max-w-2xl">
              युवा मन को सशक्त बनाने और एक मजबूत समुदाय बनाने के हमारे मिशन में हमसे जुड़ें। 
              मिलकर हम विकास, नेतृत्व और सकारात्मक बदलाव के अवसर बनाते हैं।
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-warm border-0 font-bold tracking-wide transition-colors duration-200"
              >
                <Link to="/admission">
                  प्रवेश के लिए आवेदन करें <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToNews}>
                और जानें
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
