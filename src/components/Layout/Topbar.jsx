"use client";
import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <>
      <div className="bg-[#ea2e0e] w-full text-white py-2">
        <div className="flex container mx-auto items-center justify-between">
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="hover:text-gray-300">
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-gray-300">
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-gray-300">
              <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>
          <div className="text-sm flex-grow text-center">
            Hello there! Got a great deal
          </div>
          <div className="hidden md:flex">+977 9834435723</div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
