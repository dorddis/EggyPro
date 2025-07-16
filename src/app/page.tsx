import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import TestimonialCard from '@/components/product/TestimonialCard';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { PageTransition } from '@/components/ui/page-transition';
import { HomeSkeleton } from '@/components/skeletons/home-skeleton';
import { products, testimonials } from '@/lib/constants';
import { CheckCircle, HelpCircle, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = products.slice(0, 2); // Show first two products as featured

  return (
    <PageTransition skeleton={<HomeSkeleton />}>
      <div className="space-y-12 md:space-y-16">
        {/* Hero Section */}
        <ScrollAnimation animation="fade-up" delay={0.1}>
          <section className="text-center py-8 md:py-12 bg-gradient-to-br from-primary/20 via-background to-background rounded-xl shadow-inner">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 md:mb-6 leading-tight">
                EggyPro: Protein You Can Trust
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                Discover the power of pure egg protein. Sustainably sourced, meticulously crafted, and transparently shared. Fuel your body with the best.
              </p>
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto min-h-[48px]">
                <Link href={`/product/${products[0].slug}`}>Shop EggyPro Original</Link>
              </Button>
            </div>
          </section>
        </ScrollAnimation>

        {/* Why Trust EggyPro Section */}
        <ScrollAnimation animation="fade-up" delay={0.2}>
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-10 px-4">Why Choose EggyPro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
              <ScrollAnimation animation="scale-up" delay={0.3}>
                <div className="p-4 md:p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-accent mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Premium Quality Ingredients</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Sourced from cage-free farms, ensuring the highest standards of purity and ethics.</p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="scale-up" delay={0.4}>
                <div className="p-4 md:p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-accent mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Transparent Processes</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">We believe in full transparency, from sourcing to production. Know what you're consuming.</p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="scale-up" delay={0.5}>
                <div className="p-4 md:p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 text-accent mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Customer Focused</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Your health and trust are our top priorities. We're here to support your fitness journey.</p>
                </div>
              </ScrollAnimation>
            </div>
          </section>
        </ScrollAnimation>
        
        {/* Featured Products Section */}
        <ScrollAnimation animation="fade-up" delay={0.2}>
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-10 px-4">Our Star Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {featuredProducts.map((product, index) => (
                <ScrollAnimation key={product.id} animation="slide-left" delay={0.3 + index * 0.1}>
                  <ProductCard product={product} />
                </ScrollAnimation>
              ))}
            </div>
          </section>
        </ScrollAnimation>

        {/* Testimonials Section */}
        <ScrollAnimation animation="fade-up" delay={0.2}>
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-10 px-4">Hear From Our Community</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <ScrollAnimation key={testimonial.id} animation="slide-right" delay={0.3 + index * 0.1}>
                  <TestimonialCard testimonial={testimonial} />
                </ScrollAnimation>
              ))}
            </div>
          </section>
        </ScrollAnimation>

        {/* About Us Teaser */}
        <ScrollAnimation animation="fade-up" delay={0.2}>
          <section className="text-center py-8 md:py-12 bg-secondary rounded-xl shadow-inner">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 px-4">Our Story: The EggyPro Promise</h2>
            <p className="text-base md:text-lg text-secondary-foreground/80 mb-6 md:mb-8 max-w-xl mx-auto px-4 leading-relaxed">
              Learn about our commitment to quality, transparency, and your well-being.
            </p>
            <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto min-h-[48px]">
              <Link href="/about">Discover Our Values</Link>
            </Button>
          </section>
        </ScrollAnimation>

        {/* FAQ Teaser Section */}
        <ScrollAnimation animation="fade-up" delay={0.2}>
          <section className="text-center">
            <HelpCircle className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-3 md:mb-4" />
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 px-4">Have Questions?</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 px-4 leading-relaxed">
              Our AI Assistant is here to help answer your questions instantly.
            </p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto min-h-[48px]">
              <Link href="/faq">Ask our AI Assistant</Link>
            </Button>
          </section>
        </ScrollAnimation>
      </div>
    </PageTransition>
  );
}
