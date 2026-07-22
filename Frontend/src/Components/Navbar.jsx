import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ShoppingCart,
  ShieldCheck,
  Home,
  Info,
  Package,
  Mail,
  Layers,
  Wrench,
  Heart,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useDarkMode } from "../context/DarkModeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ cartCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlistItems } = useWishlist();
  const { isDark, toggleDarkMode } = useDarkMode();

  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Scroll detection for shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Sign out?",
      text: "You will be signed out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2F5D50",
      cancelButtonColor: "#8FAE9D",
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] shadow-xl text-[#1F2937]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/", { replace: true });
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have signed out successfully.",
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: "#2F5D50",
          customClass: {
            popup: "rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] shadow-xl text-[#1F2937]",
          },
        });
      }
    });
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Products", path: "/product", icon: Package },
    { name: "Categories", path: "/categories", icon: Layers },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 transition-all duration-200 ${scrolled ? "shadow-sm border-gray-200 dark:border-gray-800" : ""
        }`}
    >
      {/* Changed max-w-7xl mx-auto to w-full px-4 sm:px-6 lg:px-8 */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ================= CORNER 1: BRAND LOGO ================= */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/20 rounded-xl transition-all"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2F5D50] hover:bg-[#244A40] flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shadow-sm group-hover:scale-[1.02] active:scale-95 transition-all duration-200 shrink-0">
              ME
            </div>
            <div className="hidden sm:flex flex-col border-l border-gray-200 dark:border-gray-800 pl-2.5">
              <span className="text-sm font-extrabold text-gray-900 dark:text-white tracking-tight leading-none logo-font">
                MANVI
              </span>
              <span className="text-[9px] font-bold text-[#2F5D50] dark:text-[#8FAE9D] tracking-[0.2em] leading-none uppercase mt-1">
                ENTERPRISES
              </span>
            </div>
          </Link>

          {/* ================= CENTER: DESKTOP NAVIGATION ================= */}
          <nav className="hidden lg:flex items-center space-x-0.5">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide inline-flex items-center gap-1.5 transition-all duration-150 ${active
                    ? "text-white bg-[#2F5D50] shadow-sm font-bold"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/60"
                    }`}
                >
                  <LinkIcon
                    className={`w-3.5 h-3.5 shrink-0 ${active ? "text-white" : "text-gray-400 dark:text-gray-400"
                      }`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ================= CORNER 2: PROFILE & ACTIONS ================= */}
          <div className="hidden md:flex items-center gap-1 shrink-0">

            {/* Search */}
            <div className="relative flex items-center" ref={searchRef}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center relative">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-44 pl-3 pr-8 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/80 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white dark:focus:bg-gray-900 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 p-1 text-gray-500 hover:text-[#2F5D50] dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Execute search"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#2F5D50] dark:hover:text-white rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-all cursor-pointer flex items-center justify-center"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#2F5D50] dark:hover:text-white rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-all cursor-pointer flex items-center justify-center"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#2F5D50] dark:hover:text-white rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-all relative flex items-center justify-center"
              title="My Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-gray-950 font-extrabold text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 leading-none shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#2F5D50] dark:hover:text-white rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-all relative flex items-center justify-center"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#2F5D50] text-white font-extrabold text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 leading-none shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1 self-center" />

            {/* User Profile / Auth Area */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/20"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-7 h-7 rounded-full border border-[#2F5D50]/30 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-[#2F5D50] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 max-w-[90px] truncate leading-none">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${profileDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                          Logged in as
                        </p>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${user.role === "admin"
                            ? "bg-[#D4A64A] text-[#1F2937]"
                            : "bg-[#2F5D50]/10 text-[#2F5D50] dark:bg-[#2F5D50]/20 dark:text-[#8FAE9D]"
                          }`}>
                          {user.role || "Customer"}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate mt-0.5">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-1 space-y-0.5 text-xs font-medium">
                      {user.role === "admin" && (
                        <Link
                          to="/dashboard?tab=products"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#2F5D50] dark:text-[#8FAE9D] bg-[#2F5D50]/10 font-bold hover:bg-[#2F5D50] hover:text-white transition"
                        >
                          <Package className="w-4 h-4 shrink-0" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/60 transition"
                      >
                        <User className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/60 transition"
                      >
                        <Heart className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>My Wishlist</span>
                      </Link>

                      <div className="h-px bg-gray-100 dark:bg-gray-700/60 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-[#2F5D50] dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-[#2F5D50] hover:bg-[#244A40] active:scale-95 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs shadow-sm transition-all duration-150 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* ================= MOBILE TOGGLE BUTTONS ================= */}
          <div className="flex items-center md:hidden gap-1 shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer flex items-center justify-center"
              title="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <Link
              to="/wishlist"
              className="p-1.5 relative rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
            >
              <Heart className="w-4 h-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-amber-500 text-gray-950 font-extrabold text-[9px] min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center border border-white dark:border-gray-900 leading-none">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="p-1.5 relative rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#2F5D50] text-white font-extrabold text-[9px] min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center border border-white dark:border-gray-900 leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none cursor-pointer flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU SLIDE-DOWN ================= */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3.5 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/80 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]"
            />
            <button
              type="submit"
              className="p-2 bg-[#2F5D50] text-white rounded-xl cursor-pointer flex items-center justify-center shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${active
                    ? "text-white bg-[#2F5D50] shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  <LinkIcon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-gray-400"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 py-1.5">
                  <div className="w-8 h-8 bg-[#2F5D50] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold transition"
                >
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>My Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-semibold cursor-pointer transition"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-2 px-3 rounded-xl text-xs transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center gap-1.5 bg-[#2F5D50] hover:bg-[#244A40] text-white font-semibold py-2 px-3 rounded-xl text-xs shadow-sm transition"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}