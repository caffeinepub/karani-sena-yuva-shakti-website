import { useGetAllNewsItems } from '../hooks/useGetAllNewsItems';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Newspaper } from 'lucide-react';

export default function NewsSection() {
  const { data: newsItems, isLoading } = useGetAllNewsItems();

  const sortedNews = newsItems
    ? [...newsItems].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : [];

  if (isLoading) {
    return (
      <section id="news" className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Latest News & Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!sortedNews || sortedNews.length === 0) {
    return (
      <section id="news" className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Latest News & Updates</h2>
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-6">
                <Newspaper className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground">No news updates available yet. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Latest News & Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNews.map((item, index) => (
            <Card key={index} className="hover:shadow-warm transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(Number(item.createdAt)).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

