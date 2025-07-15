import type { Review } from '@/lib/types';
import { Star, UserCircle, Image as ImageIcon, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NextImage from 'next/image'; // Renamed to avoid conflict with Lucide's Image
import { format } from 'date-fns';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm md:text-base text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-xl md:text-2xl font-semibold px-4 md:px-0">Customer Reviews</h3>
      {reviews.map((review) => (
        <Card key={review.id} className="shadow-md">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCircle className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground flex-shrink-0" />
                <div>
                  <CardTitle className="text-base md:text-lg">{review.reviewerName}</CardTitle>
                  <p className="text-xs text-muted-foreground">{format(new Date(review.date), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center flex-shrink-0">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 md:h-5 md:w-5 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <p className="text-sm md:text-base text-foreground/90 mb-3 leading-relaxed">{review.comment}</p>
            {review.imageUrl && (
              <div className="mt-2">
                <NextImage 
                  src={review.imageUrl} 
                  alt={`Review by ${review.reviewerName}`} 
                  width={80} 
                  height={80} 
                  className="rounded-md object-cover md:w-[100px] md:h-[100px]"
                  data-ai-hint="product review image"
                />
              </div>
            )}
            {review.videoUrl && (
               <div className="mt-2 flex items-center gap-2 text-sm md:text-base text-accent hover:text-accent/80">
                 <Video className="h-5 w-5" />
                 <a href={review.videoUrl} target="_blank" rel="noopener noreferrer" className="underline min-h-[44px] flex items-center">Watch Video Testimonial</a>
               </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewList;
