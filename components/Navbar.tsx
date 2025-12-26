
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { COMPANY_LOGO_URL } from '../constants';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    
    // If we are not on the home page, go home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Suites', id: 'suites' },
    { name: 'Explore', id: 'explore' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Leadership', id: 'team' },
    { name: 'FAQ', id: 'faq' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-richBlack/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src={COMPANY_LOGO_URL} 
            alt="Glammys Logo" 
            className="w-10 h-10 object-contain" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-wider text-white uppercase">GLAMMYS</span>
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-400">Executive Suits</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => scrollToSection(link.id)} 
              className="text-sm uppercase tracking-widest text-gray-300 hover:text-gold-400 transition-colors"
            >
              {link.name}
            </button>
          ))}
          <Button onClick={() => scrollToSection('suites')}>
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gold-500"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-richBlack border-t border-gray-800 p-6 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => scrollToSection(link.id)}
              className="text-gray-300 hover:text-gold-400 py-2 uppercase tracking-widest text-center"
            >
              {link.name}
            </button>
          ))}
          <Button fullWidth onClick={() => scrollToSection('suites')}>
            Book Now
          </Button>
        </div>
      )}
    </nav>
  );
};
