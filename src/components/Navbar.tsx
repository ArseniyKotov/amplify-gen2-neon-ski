/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  user: any;
  signOut?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ signOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-medium border-b border-neon-blue/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold neon-text">NeonSki</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/resorts"
              className="text-gray-300 hover:text-neon-blue transition-colors"
            >
              Resorts
            </Link>
            <Link
              to="/my-adventures"
              className="text-gray-300 hover:text-neon-blue transition-colors"
            >
              My Adventures
            </Link>
            <Link
              to="/plan"
              className="text-gray-300 hover:text-neon-blue transition-colors"
            >
              Plan Adventure
            </Link>
            <Link
              to="/profile"
              className="text-gray-300 hover:text-neon-blue transition-colors"
            >
              Profile
            </Link>
            <button onClick={signOut} className="cyber-button">
              Sign Out
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-medium border-t border-neon-blue/20">
            <Link
              to="/resorts"
              className="block px-3 py-2 text-gray-300 hover:text-neon-blue transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Resorts
            </Link>
            <Link
              to="/my-adventures"
              className="block px-3 py-2 text-gray-300 hover:text-neon-blue transition-colors"
              onClick={() => setIsOpen(false)}
            >
              My Adventures
            </Link>
            <Link
              to="/plan"
              className="block px-3 py-2 text-gray-300 hover:text-neon-blue transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Plan Adventure
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 text-gray-300 hover:text-neon-blue transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={signOut}
              className="block w-full text-left px-3 py-2 text-neon-blue hover:bg-dark-light transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
