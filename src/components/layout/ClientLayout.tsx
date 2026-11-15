'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BagDrawer } from './BagDrawer';
import { SearchModal } from './SearchModal';
import { AuthModal } from './AuthModal';
import { BackToTop } from './BackToTop';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-black dark:bg-brand-black bg-brand-surface-light text-neutral-900 dark:text-white transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BagDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
      <BackToTop />
    </div>
  );
}
