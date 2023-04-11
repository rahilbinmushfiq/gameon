import { useRef } from "react";
import { MdSearch } from "react-icons/md";

export default function Search({ setSearch }) {
  const searchRef = useRef(null);

  return (
    <div className="px-6 space-y-12 sm:px-10 md:px-14 lg:pr-0">
      <div className="relative flex">
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