
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BedDouble, Users, MessageCircle, Map, LogOut, ChevronLeft } from 'lucide-react';
import { StorageService } from '../services/storageService';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    StorageService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Rooms', icon: <BedDouble size={20} />, path: '/admin/rooms' },
    { name: 'Team', icon: <Users size={20} />, path: '/admin/team' },
    { name: 'FAQ', icon: <MessageCircle size={20} />, path: '/admin/faq' },
    { name: 'Explore', icon: <Map size={20} />, path: '/admin/explore' },
  ];

  return (
    <div className="min-h-screen bg-richBlack flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal border-r border-gold-500/20 flex flex-col">
        <div className="p-6 border-b border-gold-500/10">
          <h1 className="font-serif text-xl font-bold text-gold-500">Glammys Admin</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path 
                  ? 'bg-gold-500 text-richBlack font-bold' 
                  : 'text-gray-400 hover:bg-gold-500/10 hover:text-gold-500'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gold-500/10 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
            <span>Back to Website</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};
