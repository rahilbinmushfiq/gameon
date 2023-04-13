import { useRef } from "react";
import { MdSearch } from "react-icons/md";

export default function Search({ setSearch }) {
  const searchRef = useRef(null);

  return (
    <div className="px-6 space-y-12 sm:px-10 md:px-14 lg:pr-0 xl:px-24">
      <div className="space-y-2">
        <h1>Search Games</h1>
        <p>Find your next favorite game with our easy-to-use search tool. Browse through our extensive library and filter by platform, release date and more.</p>
      </div>
      <div className="relative flex xl:w-3/4">
        <input
          className="typing-input pl-12 bg-[#1f1f1f] peer"
          ref={searchRef}
          type="text"
          placeholder="Search Games"
          onChange={(e) => setSearch(e.target.value)}
        />
        <MdSearch
          className="typing-input--icon"
          size={48}
          onClick={() => searchRef.current.focus()}
        />
      </div>
    </div>
  )
}