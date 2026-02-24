import { useGetGalleryItems } from '../hooks/useGetGalleryItems';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';

export default function GallerySection() {
  const { data: galleryItems, isLoading } = useGetGalleryItems();

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">फोटो गैलरी</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!galleryItems || galleryItems.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">फोटो गैलरी</h2>
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-6">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground">अभी तक कोई फोटो उपलब्ध नहीं है। जल्द ही देखें!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">फोटो गैलरी</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-warm transition-shadow">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.image.getDirectURL()}
                  alt={item.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {item.description && (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
