import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Favorites, Logo, LogoMobile, Search, User, Cart } from "@/assets/common/icons";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/router";
import Button from "@/lib/components/base/Button";
import { getProfile } from "@/services/auth/authService";
import { useCookies } from "react-cookie";
import Input from "@/lib/components/base/Input";
import CartDropdown from "../components/CartDropdown";
import LiveSearch from "../components/LiveSearch";

const Navbar = () => {
  const router = useRouter();
  const [cookies, removeCookie] = useCookies(["accessToken", "role"]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<{ name?: string; email?: string, avatar?: string }>({});
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null | boolean>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

    const token = cookies.accessToken;

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
  }, [mounted, cookies]);

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
    removeCookie("accessToken", { path: "/" });
    removeCookie("role", { path: "/" });
    setIsProfileMenuOpen(false);

    setTimeout(() => {
      router.push("/shop/login");
    }, 1000);
  };

  return (
    <nav
      className={`sticky top-0 z-50 py-3 ps-4 bg-white max-w-7xl m-auto transition-shadow duration-300 ${scrolled ? "shadow-bottom" : ""
        }`}
    >
      <div className="container mx-auto flex items-center justify-between">

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden focus:outline-none cursor-pointer"
          aria-label="Open menu"
        >
          {isMobileMenuOpen ? <HiX color="#008ECC" /> : <HiMenu color="#008ECC" />}
        </button>

        <div className="flex items-center">

          <div className="mb-1 md:hidden">
            <LogoMobile />
          </div>

          <div className="md:block hidden">
            {!token && (
              <CartDropdown />
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {token &&
              <>
                <Link
                  href="/shop/user/cart"
                  className="flex items-center space-x-1 font-medium"
                >
                  <Cart />
                  <span className="hover:text-gray-500">سبد خرید</span>
                </Link>
                <Link
                  href="/shop/user/favorites"
                  className="flex items-center space-x-1 font-medium"
                >
                  <Favorites />
                  <span className="hover:text-gray-500">علاقه مندی ها</span>
                </Link>
              </>
            }
          </div>
        </div>

        <div className="hidden md:block">
          <LiveSearch />
        </div>

        {/* Right - Profile and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block relative flex" ref={profileMenuRef}>
            {mounted && isLoggedIn ? (
              <>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                >
                  <span>{profile.name || profile.email || 'loading'}</span>
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
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded shadow-lg w-40 z-50">
                    <div className="p-3 border-b border-gray-200 text-left">
                      <p className="font-semibold">{profile.name}</p>
                      <p>{profile.email}</p>
                    </div>
                    <div className="px-3 py-2">
                      <Link className="mb-3 hover:text-gray-500 block" href={'/shop/user/update-profile'}>ویرایش پروفایل</Link>
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
                className="flex gap-1 hover:text-gray-500"
              >
                <User />
                ورود
              </Link>
            )}
          </div>

          {/* Logo for Desktop */}
          <div className="hidden md:block mb-3 ms-2">
            <Logo />
          </div>

          {/* Left - Logo and Desktop Navigation */}
          <div className="md:hidden me-3">
            {mounted && isLoggedIn ? (
              <div className="flex items-center space-x-1">
                <span>{profile.name || profile.email || 'loading'}</span>
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
              </div>
            ) : (

              <Link
                href="/shop/login"
                className="text-sm flex items-center gap-1"
              >
                <User />
                <span className="hover:text-gray-500">ورود</span>
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-t border-gray-200 mt-2 py-3 absolute left-0 right-0 shadow-lg">
          <div className="px-1 mb-4">
            <LiveSearch />
          </div>

          <div className="flex flex-col space-y-2 px-3">

            {token && (
              <>
                <Link
                  href="/shop/user/cart"
                  className="flex items-center space-x-2 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Cart />
                  <span>سبد خرید</span>
                </Link>
                <Link
                  href="/shop/user/favorites"
                  className="flex items-center space-x-2 font-medium py-2"
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
                      <p className="text-xs">{profile.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/shop/user/update-profile"
                    className="block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ویرایش پروفایل
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                    }}
                    className="w-full text-right py-2"
                  >
                    خروج
                  </button>
                </>
              ) : (
                <Link
                  href="/shop/login"
                  className="flex items-center space-x-2 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User />
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