import type { Testimonial } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Quote, Star, Video } from 'lucide-react';
import { format } from 'date-fns';
import { useTruncatedText, getLineClampClass } from '@/lib/text-utils';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const truncatedComment = useTruncatedText(testimonial.comment, 'testimonialComment');
  
  return (
    <Card className="card-equal-height overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-out group hover:scale-[1.02] hover:-translate-y-1">
      {testimonial.image_url && (
        <div className="relative w-full h-40 sm:h-48">
          <Image
            src={testimonial.image_url}
            alt={`Testimonial by ${testimonial.reviewer_name}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            data-ai-hint="happy customer fitness"
          />
        </div>
      )}
      {testimonial.video_url && !testimonial.image_url && (
        <div className="relative w-full h-40 sm:h-48 bg-secondary flex items-center justify-center rounded-t-lg">
           <a href={testimonial.video_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 flex flex-col items-center p-4 min-h-[44px] justify-center transition-all duration-200 ease-out hover:scale-110">
            <Video size={40} className="sm:w-12 sm:h-12 transition-transform duration-200 ease-out group-hover:rotate-12" />
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
      <CardContent className="card-content-grow p-4 md:p-6 pt-0">
        <div className="flex">
          <Quote className="h-5 w-5 md:h-6 md:w-6 text-accent mr-2 mt-1 transform -scale-x-100 flex-shrink-0" />
          <p 
            className={`text-sm md:text-base text-foreground/90 italic leading-relaxed ${getLineClampClass(4)}`}
            title={truncatedComment.title}
            aria-label={truncatedComment.ariaLabel}
          >
            {truncatedComment.displayText}
          </p>
        </div>
      </CardContent>
      <CardFooter className="card-footer-auto pt-0 p-4 md:p-6">
        <div>
          <p className="font-medium text-sm md:text-base">{testimonial.reviewer_name}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(testimonial.created_at || new Date()), 'MMM d, yyyy')}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
