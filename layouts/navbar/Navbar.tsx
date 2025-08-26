import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Bag, Home, Login, Favorites, Logo, LogoMobile } from "@/assets/common/icons";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/router";
import Button from "@/lib/components/base/Button";
import { getProfile } from "@/services/auth/authService";

const Navbar = () => {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<{ name?: string; email?: string, avatar?: string }>({});
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("accessToken");

    if (token) {
      setToken(token)
      setIsLoggedIn(true);

      getProfile()
        .then((res) => {
          setProfile(res.data);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [mounted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[aria-label="Open menu"]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
    router.push("/shop/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-50 shadow-md p-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left - Logo and Desktop Navigation */}
        <div className="md:hidden">
          {mounted && isLoggedIn ? (
            <div className="flex items-center space-x-1">
              {profile.avatar && !loading ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                />
              ) : (
                <img
                  src='/images/user-35.png'
                  alt="Profile"
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                />
              )}
              <span className="text-sm text-gray-800">{profile.name || profile.email || 'loading'}</span>
            </div>
          ) : (

            <Link
              href="/shop/login"
              className="text-sm flex items-center text-gray-800 font-semibold hover:text-gray-600 gap-1"
            >
              <Login />
              <span>ورود</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Logo */}

          <div className="md:hidden">
            <LogoMobile/>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-1 font-medium text-gray-800 hover:text-gray-600"
            >
              <Home />
              <span>خانه</span>
            </Link>

            {token &&
              <>
                <Link
                  href="/shop/cart"
                  className="flex items-center space-x-1 font-medium text-gray-800 hover:text-gray-600"
                >
                  <Bag />
                  <span>سبد خرید</span>
                </Link>
                <Link
                  href="/shop/favorites"
                  className="flex items-center space-x-1 font-medium text-gray-800 hover:text-gray-600"
                >
                  <Favorites />
                  <span>علاقه مندی ها</span>
                </Link>
              </>
            }
          </div>
        </div>

        {/* Center - Logo for Desktop */}
        <div className="hidden md:block">
          <Logo/>
        </div>

        {/* Right - Profile and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block relative" ref={profileMenuRef}>
            {mounted && isLoggedIn ? (
              <>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {profile.avatar && !loading ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                    />
                  ) : (
                    <img
                      src='/images/user-35.png'
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                    />
                  )}
                  <span>{profile.name || profile.email || 'loading'}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-lg w-40 z-50">
                    <div className="p-3 border-b border-gray-200 text-left">
                      <p className="font-semibold">{profile.name}</p>
                      <p className="text-gray-500">{profile.email}</p>
                    </div>
                    <div className="px-3 py-2">
                      <Link className="mb-3 hover:text-gray-500 block" href={'/shop/update-profile'}>ویرایش پروفایل</Link>
                      <Button
                        onClick={handleSignOut}
                        text="خروج"
                        className="w-full hover:text-gray-500 text-right mt-2"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/shop/login"
                className="text-gray-800 font-semibold hover:text-gray-600 flex gap-2"
              >
                <Login />
                ورود
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-800 focus:outline-none cursor-pointer"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-t border-gray-200 mt-2 py-4 px-4 absolute left-0 right-0 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="flex items-center space-x-2 font-medium text-gray-800 hover:text-gray-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home />
              <span>خانه</span>
            </Link>

            {token && (
              <>
                <Link
                  href="/shop/cart"
                  className="flex items-center space-x-2 font-medium text-gray-800 hover:text-gray-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Bag />
                  <span>سبد خرید</span>
                </Link>
                <Link
                  href="/shop/favorites"
                  className="flex items-center space-x-2 font-medium text-gray-800 hover:text-gray-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Favorites />
                  <span>علاقه مندی ها</span>
                </Link>
              </>
            )}

            <div className="border-t border-gray-200 pt-4">
              {mounted && isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    {profile.avatar && !loading ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                      />
                    ) : (
                      <img
                        src='/images/user-35.png'
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-sm">{profile.name}</p>
                      <p className="text-gray-500 text-xs">{profile.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/shop/update-profile"
                    className="block py-2 text-gray-800 hover:text-gray-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ویرایش پروفایل
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-right py-2 text-gray-800 hover:text-gray-600"
                  >
                    خروج
                  </button>
                </>
              ) : (
                <Link
                  href="/shop/login"
                  className="flex items-center space-x-2 text-gray-800 font-semibold hover:text-gray-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Login />
                  <span>ورود به حساب</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;