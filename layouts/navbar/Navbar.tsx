import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Bag, Home, Login, Favorites } from "@/assets/common/icons";
import { useRouter } from "next/router";
import Button from "@/lib/components/base/Button";
import { getProfile } from "@/services/auth/authService";

const Navbar = () => {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<{ name?: string; email?: string }>({});
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
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
        .catch(console.error);
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
    <nav className="sticky top-0 z-50 bg-gray-50 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-1 font-medium text-gray-800 hover:text-gray-600"
          >
            <Home />
            <span>خانه</span>
          </Link>

          {/* Hydration */}
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
        <div>
          <span className="text-xl font-bold">Used Mobile Store</span>
        </div>

        {/* Right */}
        <div className="relative" ref={profileMenuRef}>
          {mounted && isLoggedIn ? (
            <>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                <img
                  src="/images/user-35.png"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                />
                <span>{profile.name || "Profile"}</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-lg w-40 z-50">
                  <div className="p-4 border-b border-gray-200 text-left">
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-gray-500">{profile.email}</p>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    text="خروج"
                    className="w-full px-4 py-2 hover:bg-gray-100 text-right"
                  />
                </div>
              )}
            </>
          ) : (
            <Link
              href="/shop/login"
              className="text-gray-800 font-semibold hover:text-gray-600 flex gap-2"
            >
              <Login />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
