import { useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";

export default function Search({ setSearch }) {
  const searchRef = useRef(null);

  return (
    <div className="pb-8 px-6 space-y-12">
      <div className="space-y-2">
        <h1 className="inline-block mb-1 text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
          SEARCH GAMES
        </h1>
        <p className="text-[#a9a9a9] leading-6">
          Find your next favorite game with our easy-to-use search tool. Browse through our extensive library and filter by platform, release date and more.
        </p>
      </div>
      <div className="relative flex">
        <input
          className="w-full h-12 pl-12 rounded-sm bg-[#1f1f1f] caret-[#f1f1f1] border border-[#4f4f4f] focus:outline-none focus:border focus:border-[#e30e30]/60 placeholder:text-[#9a9a9a]"
          ref={searchRef}
          type="text"
          placeholder="Search Games"
          onChange={(e) => setSearch(e.target.value)}
        />
        <IoSearchOutline
          className="absolute inset-0 p-4"
          size={48}
          color="#f1f1f1"
          onClick={() => searchRef.current.focus()}
        />
      </div>
    </div>
  )
}