import { PageTransition } from '@/components/ui/page-transition';
import { FaqSkeleton } from '@/components/skeletons/faq-skeleton';
import FaqAssistant from '@/components/FaqAssistant';

export const metadata = {
  title: 'EggyPro FAQ | Get Instant Answers',
  description: 'Ask our AI-powered assistant any questions about EggyPro products, shipping, or policies.',
};

export default function FaqPage() {
  return (
    <PageTransition skeleton={<FaqSkeleton />}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 md:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Find answers to common questions about EggyPro protein powder.
          </p>
        </div>

        <FaqAssistant />
      </div>
    </PageTransition>
  );
}
