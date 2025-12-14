"use client"

import React, { useState } from 'react';


import { Menu, X } from 'lucide-react';
import { IconMail } from '@tabler/icons-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <IconMail />
              MailHub
            </a>
          </div>
          {/* Right side buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <a
              href="/auth/login"
              className="text-gray-700 hover:text-gray-900 text-[15px] font-normal px-4 py-2 transition-colors duration-150"
            >
              LogIn
            </a>
            <a
              href="/auth/signup"
              className="bg-black hover:bg-gray-800 text-white text-[15px] font-medium px-6 py-2.5 rounded-full transition-colors duration-150"
            >
              Sign up
            </a>
          </div>
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-white">
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <a
                href="/auth/login"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-normal transition-colors duration-150"
                onClick={() => setIsOpen(false)}
              >
                LogIn
              </a>
              <a
                href="/auth/signup"
                className="bg-black hover:bg-gray-800 text-white block text-center px-6 py-2.5 rounded-full text-base font-medium transition-colors duration-150"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

