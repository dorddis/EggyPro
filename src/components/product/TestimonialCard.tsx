import type { Testimonial } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Quote, Star, Video } from 'lucide-react';
import { format } from 'date-fns';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg">
      {testimonial.imageUrl && (
        <div className="relative w-full h-40 sm:h-48">
          <Image
            src={testimonial.imageUrl}
            alt={`Testimonial by ${testimonial.reviewerName}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            data-ai-hint="happy customer fitness"
          />
        </div>
      )}
      {testimonial.videoUrl && !testimonial.imageUrl && (
        <div className="relative w-full h-40 sm:h-48 bg-secondary flex items-center justify-center rounded-t-lg">
           <a href={testimonial.videoUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 flex flex-col items-center p-4 min-h-[44px] justify-center">
            <Video size={40} className="sm:w-12 sm:h-12" />
            <p className="text-sm mt-2 text-center">Watch Video</p>
          </a>
        </div>
      )}
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl font-semibold text-primary leading-tight">{testimonial.title}</CardTitle>
        {testimonial.rating && (
          <div className="flex items-center mt-1">
            {Array(5).fill(0).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < testimonial.rating! ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-6 pt-0">
        <div className="flex">
          <Quote className="h-5 w-5 md:h-6 md:w-6 text-accent mr-2 mt-1 transform -scale-x-100 flex-shrink-0" />
          <p className="text-sm md:text-base text-foreground/90 italic leading-relaxed">{testimonial.comment}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 p-4 md:p-6">
        <div>
          <p className="font-medium text-sm md:text-base">{testimonial.reviewerName}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(testimonial.date), 'MMM d, yyyy')}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
