import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Calendar, User, LogOut, LayoutDashboard, Settings, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-bold text-base sm:text-lg md:text-xl">Court Booking</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <>
                <Link to="/">
                  <Button variant="ghost" size="sm" className="text-sm">
                    <Home className="h-4 w-4 mr-1.5" />
                    Home
                  </Button>
                </Link>
                <Link to="/courts">
                  <Button variant="ghost" size="sm" className="text-sm">Browse Courts</Button>
                </Link>
                {user.role !== 'admin' && (
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="text-sm">
                      <LayoutDashboard className="h-4 w-4 mr-1.5" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="text-sm">
                      <Settings className="h-4 w-4 mr-1.5" />
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2 px-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm">
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm" className="text-sm">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2 px-3 bg-gray-50 rounded-md">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link to="/courts" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    Browse Courts
                  </Button>
                </Link>
                {user.role !== 'admin' && (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full justify-start text-sm" size="sm" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-sm" size="sm">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
