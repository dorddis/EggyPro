'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/product/eggypro-original', label: 'Product' },
  { href: '/about', label: 'About Us' },
  { href: '/faq', label: 'FAQ' },
];

interface NavbarProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ mobile = false, onItemClick }) => {
  const pathname = usePathname();

  return (
    <nav className={cn(
      mobile 
        ? "flex flex-col space-y-4" 
        : "flex items-center space-x-4 lg:space-x-6"
    )}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className={cn(
            mobile 
              ? 'block py-2 px-3 text-base font-medium transition-colors hover:text-primary hover:bg-primary/10 rounded-md min-h-[44px] flex items-center'
              : 'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href ? 'text-primary' : 'text-foreground/70',
            mobile && pathname === item.href && 'bg-primary/10'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
