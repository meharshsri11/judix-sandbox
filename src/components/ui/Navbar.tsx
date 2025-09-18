'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = ['Features', 'Pricing', 'About Us'];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-[#030712]/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center space-x-2">
          <span className="font-sora text-2xl font-bold">Judix</span>
        </a>
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link}><a href="#" className="font-outfit text-gray-300 transition-colors hover:text-white">{link}</a></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="default" className="hidden rounded-full bg-white text-black hover:bg-gray-200 sm:block">Contact us</Button>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 px-6 pb-6 pt-2">
            {navLinks.map((link) => (
              <a key={link} href="#" className="font-outfit text-gray-300 transition-colors hover:text-white">{link}</a>
            ))}
            <Button className="w-full rounded-full bg-white text-black hover:bg-gray-200">Contact us</Button>
          </nav>
        </div>
      )}
    </header>
  );
}