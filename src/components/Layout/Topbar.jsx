"use client";
import React from "react";
import { AiFillTikTok } from "react-icons/ai";
import { SiFacebook } from "react-icons/si";

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] w-full p-3 text-white relative">
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Social Icons */}
        <div className="hidden md:flex items-center space-x-4 z-10">
          <button>
            <a
              href="https://www.facebook.com/profile.php?id=61587557573469"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              <SiFacebook className="h-5 w-5" />
            </a>
          </button>
          <button>
            <a
              href="https://www.tiktok.com/@rabbithubnepal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition"
            >
              <AiFillTikTok className="h-6 w-6" />
            </a>
          </button>
        </div>

        {/* Center Text (does NOT block clicks now) */}
        <div className="absolute left-1/2 -translate-x-1/2 text-sm whitespace-nowrap pointer-events-none">
          Rabbit - Dress well, live better
        </div>

        {/* Contact */}
        <div className="hidden md:flex z-10">+977 97xxxxxxxx</div>
      </div>
    </div>
  );
};

export default Topbar;
