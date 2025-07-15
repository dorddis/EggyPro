import { ShieldCheck, CreditCard, Lock } from 'lucide-react';

const TrustBadges = () => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 p-4 md:p-6 bg-secondary/50 rounded-lg border border-border">
      <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground min-h-[44px] sm:min-h-0">
        <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-accent flex-shrink-0" />
        <span className="text-center sm:text-left">Secure SSL Encryption</span>
      </div>
      <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground min-h-[44px] sm:min-h-0">
        <Lock className="h-5 w-5 md:h-6 md:w-6 text-accent flex-shrink-0" />
        <span className="text-center sm:text-left">Safe Checkout</span>
      </div>
      <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground min-h-[44px] sm:min-h-0">
        <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-accent flex-shrink-0" />
        <span className="text-center sm:text-left">Multiple Payment Options</span>
      </div>
      {/* You can add logos of payment providers here if needed */}
      {/* Example: <img src="/path/to/visa-logo.svg" alt="Visa" className="h-6" /> */}
    </div>
  );
};

export default TrustBadges;
