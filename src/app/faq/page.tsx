import FaqAssistant from '@/components/FaqAssistant';

export const metadata = {
  title: 'EggyPro FAQ | Get Instant Answers',
  description: 'Ask our AI-powered assistant any questions about EggyPro products, shipping, or policies.',
};

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <FaqAssistant />
    </div>
  );
}
