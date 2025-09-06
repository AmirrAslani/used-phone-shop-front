import React, { useState, useEffect, useCallback } from "react";
import { getAllPhones } from "@/services/single/singleService";
import { useRouter } from "next/router";
import Input from "@/lib/components/base/Input";
import { Search, Spinner } from "@/assets/common/icons";

const LiveSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const router = useRouter();

    // تابع سرچ با debounce
    const fetchData = useCallback((searchText: string) => {
        if (searchText.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        getAllPhones(searchText)
            .then((res) => {
                setResults(res.data || []);
                setShowDropdown(true);
            })
            .catch((err) => {
                console.error("Error fetching search results:", err);
                setResults([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // debounce handler
    useEffect(() => {
        const handler = setTimeout(() => {
            if (query) fetchData(query);
        }, 800);
        return () => clearTimeout(handler);
    }, [query, fetchData]);

    return (
        <div className="relative w-full">
            <Input
                type="text"
                name="Search"
                placeholder="نام کالا، مشخصات، مدل..."
                value={query}
                icon={<Search />}
                onChange={(e) => {
                    const value = e.target.value;
                    setQuery(value);
                    if (value.trim().length <= 1) {
                        setShowDropdown(false);
                    }

                }}
                onFocus={() => query.length >= 2 && setShowDropdown(true)}
                onBlur={() => { setTimeout(() => setShowDropdown(false), 100), setQuery('') }}
                className="w-full sm:[w-350px] lg:w-[530px]"
            />

            {/* Backdrop */}
            {showDropdown && (
                <div
                    className="fixed inset-x-0 top-[119px] md:top-[80px] bottom-0 bg-black/10 backdrop-blur-sm z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}

            {/* Dropdown */}
            {showDropdown && (
                <ul className="absolute left-0 right-0 bg-white shadow-lg rounded-b-sm md:rounded-b-lg mt-0.5 min-h-33 max-h-75 overflow-y-auto z-50">
                    {loading ? (
                        <Spinner customClassName="border-primary-500 mt-3" />
                    ) : results.length > 0 ? (
                        results.map((phone) => (
                            <div className="p-2">
                                <li
                                    key={phone.id}
                                    className="hover:bg-gray-100 cursor-pointer flex items-center gap-1 border-b border-gray-200 pb-1"
                                    onClick={() => router.push(`/shop/single/${phone.id}`)}
                                >
                                    <img
                                        src={phone.image}
                                        alt={phone.model}
                                        className="w-10 h-10 rounded"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{phone.brand}</p>
                                        <p className="text-xs text-gray-500 truncate w-48">
                                            {phone.model}
                                        </p>
                                    </div>
                                </li>
                            </div>
                        ))
                    ) : query.trim().length >= 2 ? (
                        <li className="p-2 text-center">موردی یافت نشد!</li>
                    ) : null}
                </ul>
            )}
        </div>
    );
};

export default LiveSearch;
