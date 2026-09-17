import React, { useState } from 'react';
import {
  Leaf,
  Bell,
  Menu,
  X,
  MessageSquare,
  Compass,
  MapPin,
  Trophy,
  Activity,
  Flame,
  Globe,
  HelpCircle,
  CheckCircle2,
  LogIn,
  LogOut,
  UserPlus,
  Sun,
  Moon,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveTab } from '../../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    setIsAssistantOpen,
    isAuthenticated,
    logout,
  } = usePlatform();

  const { resolvedTheme, toggleTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isNavActive = (tab: ActiveTab) => {
    if (tab === 'dashboard') {
      return (
        activeTab === 'dashboard' ||
        [
          'actions',
          'my_impact',
          'my_community',
          'challenges',
          'climate_map',
          'leaderboard',
          'local_events',
        ].includes(activeTab)
      );
    }
    if (tab === 'communities') {
      return activeTab === 'communities' || activeTab === 'explore_communities';
    }
    return activeTab === tab;
  };

  const navItemClass = (tab: ActiveTab) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
      isNavActive(tab)
        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs border border-emerald-200 dark:border-emerald-800/60'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const handleNavClick = (tab: ActiveTab) => {
    setIsMobileMenuOpen(false);
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-slate-900 dark:text-white tracking-tight block">EcoCommunity</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">Climate Action & Reduction Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links - Main sections only; dashboard subsections live inside the Dashboard */}
          <nav className="hidden lg:flex items-center gap-1">
            <button onClick={() => handleNavClick('home')} className={navItemClass('home')}>
              Home
            </button>
            <button onClick={() => handleNavClick('how_it_works')} className={navItemClass('how_it_works')}>
              How It Works
            </button>
            <button onClick={() => handleNavClick('communities')} className={navItemClass('communities')}>
              Communities
            </button>
            <button onClick={() => handleNavClick('global_impact')} className={navItemClass('global_impact')}>
              Global Impact
            </button>
            {isAuthenticated && (
              <button onClick={() => handleNavClick('dashboard')} className={navItemClass('dashboard')}>
                Dashboard
              </button>
            )}
          </nav>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center justify-center group"
              title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              id="header-ai-assistant-btn"
              onClick={() => setIsAssistantOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors relative cursor-pointer"
              title="AI Climate Assistant"
              aria-label="AI Climate Assistant"
            >
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.2 text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 text-slate-900 dark:text-slate-100">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Verified actions & community alerts</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          !n.read ? 'bg-emerald-50/40 dark:bg-emerald-950/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 inline-block">{n.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 px-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      View all notification settings & SMS
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Pill / Authentication CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-90 transition-opacity select-none text-left"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="hidden md:block text-left leading-tight">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate max-w-[110px]">{user.name}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{user.totalKgCo2eAvoided} kg CO2e</span>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs text-slate-900 dark:text-slate-100">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{user.email}</p>
                      <span className="inline-block px-2 py-0.5 mt-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold rounded-md border border-emerald-200 dark:border-emerald-800/50">
                        {user.communityName || 'Coimbatore EcoAlliance'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                      >
                        📊 View Dashboard
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        id="user-signout-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  id="nav-login-btn"
                  onClick={() => handleNavClick('login')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => handleNavClick('register')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-4">
          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Appearance Theme</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 bg-white dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white shadow-2xs border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 cursor-pointer"
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {isAuthenticated ? (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-between mb-3 border border-emerald-100 dark:border-emerald-800/40">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 truncate max-w-[150px]">{user.name}</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate max-w-[150px]">{user.communityName}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-900/80 px-2 py-0.5 rounded-md shrink-0">
                {user.totalKgCo2eAvoided} kg
              </span>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between mb-3 border border-slate-200 dark:border-slate-700">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">EcoCommunity Portal</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Sign in to track verified impact</p>
              </div>
              <button
                onClick={() => {
                  handleNavClick('login');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
              >
                Log In
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 text-left text-xs font-medium rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                isNavActive('home') ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🏡</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavClick('how_it_works')}
              className={`p-2.5 text-left text-xs font-medium rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                isNavActive('how_it_works') ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>⚙️</span>
              <span>How It Works</span>
            </button>
            <button
              onClick={() => handleNavClick('communities')}
              className={`p-2.5 text-left text-xs font-medium rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                isNavActive('communities') ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>👥</span>
              <span>Communities</span>
            </button>
            <button
              onClick={() => handleNavClick('global_impact')}
              className={`p-2.5 text-left text-xs font-medium rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                isNavActive('global_impact') ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🌍</span>
              <span>Global Impact</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`col-span-2 p-2.5 text-left text-xs font-medium rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  isNavActive('dashboard') ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>📊</span>
                  <span className="font-semibold">User Dashboard</span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Subsections inside →</span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <button
                id="mobile-signout-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.name})</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="mobile-login-btn"
                  onClick={() => handleNavClick('login')}
                  className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  id="mobile-signup-btn"
                  onClick={() => handleNavClick('register')}
                  className="p-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

