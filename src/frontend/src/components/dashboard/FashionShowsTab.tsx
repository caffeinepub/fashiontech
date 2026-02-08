import { useGetFashionShows } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Eye } from 'lucide-react';
import type { FashionShow } from '../../backend';

export default function FashionShowsTab() {
  const { data: shows, isLoading } = useGetFashionShows();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Fashion Shows Available</h3>
          <p className="text-muted-foreground">
            Stay tuned for upcoming virtual fashion shows!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Virtual Fashion Shows</h2>
        <p className="text-muted-foreground">
          Experience immersive fashion collections from around the world
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {shows.map((show) => (
          <FashionShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}

function FashionShowCard({ show }: { show: FashionShow }) {
  const scheduledDate = new Date(Number(show.scheduledAt) / 1000000);
  const isUpcoming = scheduledDate > new Date();

  return (
    <Card className="hover-lift overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 relative">
        <img 
          src="/assets/generated/virtual-runway.dim_1000x600.jpg" 
          alt={show.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={isUpcoming ? 'default' : 'secondary'}>
            {isUpcoming ? 'Upcoming' : 'Available'}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {show.title}
        </CardTitle>
        <CardDescription>{show.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {scheduledDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
        
        {show.collections.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Collections:</p>
            <div className="flex flex-wrap gap-2">
              {show.collections.map((collection, idx) => (
                <Badge key={idx} variant="outline">
                  {collection}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full">
          <Eye className="mr-2 h-4 w-4" />
          View Show
        </Button>
      </CardContent>
    </Card>
  );
}
