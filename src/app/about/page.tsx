import Image from 'next/image';
import { Award, Feather, HeartHandshake, Leaf, Microscope, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'About EggyPro | Our Story & Values',
  description: 'Learn about EggyPro\'s commitment to quality, transparency, and sustainable egg protein.',
};

export default function AboutPage() {
  return (
    <div className="space-y-8 md:space-y-12">
      <section className="text-center py-8 md:py-10 bg-gradient-to-b from-primary/10 to-background rounded-lg">
        <Feather className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto mb-3 md:mb-4" />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 md:mb-4 px-4 leading-tight">Our Story: The EggyPro Promise</h1>
        <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto px-4 leading-relaxed">
          At EggyPro, we believe that trust is earned, not given. Our journey began with a simple mission: to provide the purest, highest-quality egg protein powder, backed by transparency and a deep commitment to our customers' health and our planet's well-being.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary mb-3 md:mb-4 leading-tight">From Farm to Shaker: Our Commitment</h2>
          <p className="text-sm md:text-base text-foreground/90 mb-3 md:mb-4 leading-relaxed">
            We meticulously oversee every step of our process. It starts with partnering with ethical farms that prioritize animal welfare, providing cage-free environments for their hens. These happy hens lay quality eggs, which form the foundation of EggyPro.
          </p>
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Our state-of-the-art production facilities use gentle processing techniques to carefully separate and dry the egg whites, preserving their rich nutritional profile. We avoid harsh chemicals and unnecessary additives, ensuring you get a clean, effective protein source.
          </p>
        </div>
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-xl order-first md:order-last">
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="EggyPro production process" 
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="farm eggs" 
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8 text-primary px-4">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center p-4 md:p-6">
              <Award className="h-8 w-8 md:h-10 md:w-10 text-accent mb-2 md:mb-3" />
              <CardTitle className="text-base md:text-lg">Uncompromising Quality</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm md:text-base text-muted-foreground p-4 md:p-6 pt-0 leading-relaxed">
              We never cut corners. From sourcing the finest eggs to rigorous quality control, excellence is our standard.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center p-4 md:p-6">
              <Microscope className="h-8 w-8 md:h-10 md:w-10 text-accent mb-2 md:mb-3" />
              <CardTitle className="text-base md:text-lg">Full Transparency</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm md:text-base text-muted-foreground p-4 md:p-6 pt-0 leading-relaxed">
              You deserve to know what's in your protein. We provide clear ingredient lists and information about our processes.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center p-4 md:p-6">
              <Leaf className="h-8 w-8 md:h-10 md:w-10 text-accent mb-2 md:mb-3" />
              <CardTitle className="text-base md:text-lg">Sustainability & Ethics</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm md:text-base text-muted-foreground p-4 md:p-6 pt-0 leading-relaxed">
              We are committed to environmentally friendly practices and ethical sourcing, respecting animals and our planet.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center p-4 md:p-6">
              <HeartHandshake className="h-8 w-8 md:h-10 md:w-10 text-accent mb-2 md:mb-3" />
              <CardTitle className="text-base md:text-lg">Customer Trust</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm md:text-base text-muted-foreground p-4 md:p-6 pt-0 leading-relaxed">
              Building lasting relationships with our customers based on honesty and integrity is paramount.
            </CardContent>
          </Card>
           <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center p-4 md:p-6">
              <Users className="h-8 w-8 md:h-10 md:w-10 text-accent mb-2 md:mb-3" />
              <CardTitle className="text-base md:text-lg">Community Focused</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm md:text-base text-muted-foreground p-4 md:p-6 pt-0 leading-relaxed">
              We aim to support and inspire our community on their health and fitness journeys.
            </CardContent>
          </Card>
           <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center p-4 md:p-6">
              <Feather className="h-8 w-8 md:h-10 md:w-10 text-accent mb-2 md:mb-3" />
              <CardTitle className="text-base md:text-lg">Pure & Simple</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm md:text-base text-muted-foreground p-4 md:p-6 pt-0 leading-relaxed">
             We believe in the power of nature, offering products with minimal, clean ingredients.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center py-8 md:py-10 bg-secondary rounded-lg">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-3 md:mb-4 px-4">Join the EggyPro Family</h2>
        <p className="text-base md:text-lg text-secondary-foreground/80 max-w-2xl mx-auto px-4 leading-relaxed">
          We're more than just a protein company; we're a partner in your pursuit of a healthier, stronger life. We invite you to experience the EggyPro difference.
        </p>
      </section>
    </div>
  );
}
