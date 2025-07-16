'use client';

import Link from 'next/link';
import { EggFried, Menu, X } from 'lucide-react';
import Navbar from './Navbar';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CartIcon from '@/components/cart/CartIcon';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside or on escape
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-all duration-200 ease-out hover:scale-[1.02] min-h-[44px] md:min-h-0 group"
          onClick={closeMobileMenu}
        >
          <EggFried className="h-6 w-6 md:h-8 md:w-8 transition-transform duration-200 ease-out group-hover:rotate-12" />
          <span>EggyPro</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        
        {/* Desktop Cart Icon */}
        <div className="hidden md:block">
          <CartIcon />
        </div>
        
        {/* Mobile: Cart Icon + Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <CartIcon />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 transition-all duration-200 ease-out hover:scale-110"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 transition-transform duration-200 ease-out" /> : <Menu className="h-5 w-5 transition-transform duration-200 ease-out" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-sm shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <Navbar mobile onItemClick={closeMobileMenu} />
          </div>
        </div>
      )}
      
    </header>
  );
};

export default Header;
