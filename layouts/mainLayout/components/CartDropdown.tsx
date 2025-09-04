import { useState, useRef, useEffect } from "react";
import { Cart } from "@/assets/common/icons";

export default function CartDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 cursor-pointer"
      >
        <Cart />
        <span>سبد خرید</span>
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute right-0 text-center mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <p className="text-sm text-gray-600">سبد خرید خالی است</p>
        </div>
      )}
    </div>
  );
}
