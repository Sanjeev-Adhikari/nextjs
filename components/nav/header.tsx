"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      {/* Search Bar */}
      <div className="flex items-center relative gap-4">
       
      </div>

      {/* User Profile */}
      <div className="relative">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={toggleDropdown}
        >
          <span className="text-gray-700 text-xs">Super Admin</span>
          <img
            src="/images/avatar.png"
            alt="User Profile"
            className="w-6 h-6 rounded-full border border-gray-300"
          />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border  border-gray-200 rounded-md shadow-lg">
            <ul className="py-1">
              <li>
                <Link
                  href="/dashboard/logout"
                  className=" px-4 py-2 text-xs flex justify-start items-center gap-2  text-gray-700 hover:bg-gray-100"
                >
                  <img
                    src="/images/logout.png"
                    alt="profile-logout"
                    className="w-4"
                  />
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
