'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Heart, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { items, toggleCart, getItemCount } = useCartStore();
  const { itemIds } = useWishlistStore();
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();

  const cartCount = getItemCount();
  const wishlistCount = itemIds.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'SHOP', href: '/shop' },
    { 
      label: 'CUSTOMIZE', 
      href: '/customize',
      highlight: true
    },
    { label: 'COLLECTIONS', href: '/collections' },
    { label: 'ABOUT', href: '/about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-black/90 dark:bg-brand-black/90 bg-white/90 backdrop-blur-md border-b border-brand-surface-borderDark/60 dark:border-brand-surface-borderDark/60 border-brand-surface-borderLight/60 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Brand Logo */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="group flex items-center gap-1.5 focus:outline-none"
              aria-label="FitXxx Home"
            >
              <span className="font-display text-2xl sm:text-3xl font-black tracking-tighter text-brand-black dark:text-white transition-colors duration-200">
                FIT<span className="text-brand-crimson group-hover:drop-shadow-[0_0_12px_rgba(229,9,36,0.6)] transition-all">XXX</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest font-mono uppercase px-1.5 py-0.5 rounded border border-neutral-700/60 text-neutral-400">
                SEOUL / IN
              </span>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold tracking-widest transition-all duration-200 relative py-1 ${
                    isActive
                      ? 'text-brand-crimson'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-brand-crimson dark:hover:text-brand-crimson'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.highlight && (
                      <Sparkles className="w-3 h-3 text-brand-crimson animate-pulse" />
                    )}
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-crimson rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Action Icons: Dark/Light Toggle, Search, Wishlist, Account, Shopping Bag */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-brand-crimson dark:hover:text-brand-crimson transition-colors"
              aria-label="Search Catalog"
              title="Search products (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-brand-crimson dark:hover:text-brand-crimson transition-colors hidden sm:block"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-crimson text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile */}
            <div className="relative">
              {isAuthenticated && user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-800/40 transition-colors"
                  aria-label="User Account"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-crimson/20 border border-brand-crimson text-brand-crimson flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-brand-crimson dark:hover:text-brand-crimson transition-colors"
                  aria-label="Account Login"
                  title="Sign In / Register"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* User Dropdown */}
              {userDropdownOpen && isAuthenticated && user && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-brand-charcoal border border-brand-surface-borderDark shadow-2xl py-2 z-50 text-white animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-brand-surface-borderDark">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Signed in as</p>
                    <p className="text-sm font-bold truncate text-white">{user.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold tracking-wider text-amber-400 hover:bg-brand-surface-cardDark transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      ADMIN COMMAND CENTER
                    </Link>
                  )}

                  <Link
                    href="/account"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium tracking-wide text-neutral-200 hover:bg-brand-surface-cardDark transition-colors"
                  >
                    MY ORDERS & TRACKING
                  </Link>

                  <Link
                    href="/account/designs"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium tracking-wide text-neutral-200 hover:bg-brand-surface-cardDark transition-colors"
                  >
                    SAVED 3D DESIGNS ({user.savedDesigns?.length || 0})
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium tracking-wide text-brand-crimson hover:bg-brand-surface-cardDark transition-colors border-t border-brand-surface-borderDark mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    SIGN OUT
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag Drawer Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-brand-crimson dark:hover:text-brand-crimson transition-colors"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-crimson text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-neutral-700 dark:text-neutral-300 hover:text-brand-crimson transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-brand-black/98 border-b border-brand-surface-borderDark px-6 py-8 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-bold tracking-widest text-neutral-200 hover:text-brand-crimson flex items-center justify-between py-2 border-b border-neutral-900"
              >
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40">
                    3D Studio
                  </span>
                )}
              </Link>
            ))}

            <Link
              href="/wishlist"
              className="text-base font-bold tracking-widest text-neutral-200 hover:text-brand-crimson flex items-center justify-between py-2 border-b border-neutral-900"
            >
              <span>WISHLIST</span>
              <span className="text-xs font-mono text-neutral-500">({wishlistCount})</span>
            </Link>

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-base font-bold tracking-widest text-amber-400 hover:text-amber-300 flex items-center justify-between py-2 border-b border-neutral-900"
              >
                <span>ADMIN COMMAND CENTER</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </Link>
            )}

            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">MODE / CURRENCY</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white">INR (₹)</span>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
