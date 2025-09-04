import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowDown } from "@/assets/common/icons";
import Button from "./Button";

interface DropdownItem {
    label: string;
    href: string;
}

interface DropdownProps {
    label: string;
    items: DropdownItem[];
}

export default function Dropdown({ label, items }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(label);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isHover, setIsHover] = useState(false);

    // بستن دراپ‌داون وقتی بیرون کلیک میشه
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* دکمه اصلی */}
            <Button
                text={selected}
                icon={<ArrowDown stroke={isHover ? "#fff" : "#008ECC"} />}
                onClick={() => setOpen(!open)}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className="flex items-center justify-center gap-1 bg-[#f0f5f7] hover:text-white font-light text-xs lg:text-base px-2 sm:px-3 py-2 rounded-full shadow hover:bg-[#008ECC] transition w-[100%] sm:w-[140px]" />

            {/* لیست آیتم‌ها */}
            {open && (
                <ul className="absolute -right-3 sm:right-0 mt-2 min-w-28 md:min-w-44 text-sm lg:text-base bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {items.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={() => {
                                    setSelected(item.label);
                                    setOpen(false);
                                }}
                                className="block px-2 py-2 hover:bg-gray-100 text-gray-700"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
