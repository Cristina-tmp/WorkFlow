"use client";

import React from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";

type Props = {};

const Header = (props: Props) => {
  return (
    <header>
      {/* gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50"></div>
      <div className="flex flex-col md:flex-row items-center p-5 rounded-2xl">
        <Image
          src="/logo_hi.png"
          alt="logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        <div className="w-full flex items-center space-x-4 flex-1 justify-end">
          {/* search box */}
          <form
            action=""
            className="flex items-center space-x-4 bg-white rounded-md shadow-md p-2 flex-1 md:flex-initial"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* avatar */}
          <Avatar name="Cristina" round size="50" color="#8b5cf6" />
        </div>
      </div>

      {/* suggestion */}
      <div className="flex py-2 items-center justify-center px-5 md:py-5">
        <p className="p-5 flex items-center text-sm font-light shadow-xl rounded-xl pr-5 w-fit bg-white italic max-w-3xl text-[#8b5cf6]">
          <UserCircleIcon className="h-10 w-10 inline-block mr-1 text-[#8b5cf6]" />
          GPT is summeraings djnknfdkkjfj
        </p>
      </div>
    </header>
  );
};

export default Header;
