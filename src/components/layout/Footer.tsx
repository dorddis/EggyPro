import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 mb-8 md:mb-8">
          <div>
            <h3 className="text-lg md:text-lg font-bold mb-4 text-primary">EggyPro</h3>
            <p className="text-base md:text-base leading-relaxed text-secondary-foreground/90">Pure egg protein for a healthier you. Built on trust and quality.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-base md:text-base">Quick Links</h4>
            <ul className="space-y-3 text-base md:text-base">
              <li><Link href="/about" className="hover:text-primary transition-colors block py-2 min-h-[44px] md:min-h-0 flex items-center md:block text-secondary-foreground/90 hover:text-primary">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors block py-2 min-h-[44px] md:min-h-0 flex items-center md:block text-secondary-foreground/90 hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors block py-2 min-h-[44px] md:min-h-0 flex items-center md:block text-secondary-foreground/90 hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors block py-2 min-h-[44px] md:min-h-0 flex items-center md:block text-secondary-foreground/90 hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-base md:text-base">Connect With Us</h4>
            <div className="flex space-x-6 md:space-x-4">
              <Link href="#" aria-label="Facebook" className="text-secondary-foreground/90 hover:text-primary transition-colors p-3 min-h-[48px] min-w-[48px] flex items-center justify-center md:p-2 md:min-h-[44px] md:min-w-[44px] rounded-lg hover:bg-primary/10">
                <Facebook size={28} className="md:w-6 md:h-6" />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-secondary-foreground/90 hover:text-primary transition-colors p-3 min-h-[48px] min-w-[48px] flex items-center justify-center md:p-2 md:min-h-[44px] md:min-w-[44px] rounded-lg hover:bg-primary/10">
                <Instagram size={28} className="md:w-6 md:h-6" />
              </Link>
              <Link href="#" aria-label="X" className="text-secondary-foreground/90 hover:text-primary transition-colors p-3 min-h-[48px] min-w-[48px] flex items-center justify-center md:p-2 md:min-h-[44px] md:min-w-[44px] rounded-lg hover:bg-primary/10">
                <FontAwesomeIcon icon={faXTwitter} className="w-7 h-7 md:w-6 md:h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-base md:text-base border-t border-border pt-6 md:pt-6 mt-2">
          <p className="text-secondary-foreground/80">&copy; {new Date().getFullYear()} EggyPro. All rights reserved. Built with trust.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
