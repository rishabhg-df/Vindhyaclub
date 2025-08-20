
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { navLinks as defaultNavLinks } from '@/lib/data';
import { useAdmin } from '@/context/AdminContext';
import { useEvents } from '@/context/EventContext';

export function ClientHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout } = useAdmin();
  const { events, loading } = useEvents();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = useMemo(() => {
    if (!isClient || loading || events.length > 0) {
      return defaultNavLinks;
    }
    return defaultNavLinks.filter((link) => link.href !== '/events');
  }, [events, loading, isClient]);

  const authLink = isLoggedIn
    ? { href: '/admin', label: 'Admin' }
    : { href: '/signin', label: 'Sign In' };

  const allLinks = [...navLinks, authLink];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const NavLinks = ({ className }: { className?: string }) => (
    <nav
      className={cn(
        'flex items-center gap-2 text-sm font-medium uppercase tracking-wider lg:gap-4',
        className
      )}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setIsOpen(false)}
          className={cn(
            'relative px-3 py-2 transition-colors hover:text-primary',
            pathname === link.href ? 'text-primary' : 'text-white'
          )}
        >
          {pathname === link.href && (
            <div className="absolute inset-0 z-[-1] -skew-x-[20deg] bg-white" />
          )}
          {link.label}
        </Link>
      ))}
    </nav>
  );

  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-black px-4 py-2 text-white shadow-md md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-headline text-3xl font-bold text-primary">
            Vindhya Club
          </span>
        </Link>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-black px-4 py-2 text-white shadow-md md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-headline text-3xl font-bold text-primary">
          Vindhya Club
        </span>
      </Link>

      <div className="hidden items-center gap-4 md:flex">
        <NavLinks />
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-7 w-7" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        )}
      </div>

      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black text-white">
            <div className="flex flex-col items-center gap-8 pt-12">
              <nav className="flex flex-col items-center gap-6 text-lg font-medium">
                {allLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'transition-colors hover:text-primary',
                      pathname === link.href ? 'text-primary' : 'text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {isLoggedIn && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
