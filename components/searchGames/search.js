import { useRef } from "react";
import { MdSearch } from "react-icons/md";

/*
 * The Search component displays a search bar and a section header on the search games page.
 * Users can type in the search bar to search for games by name.
 *
 * @param {Function} setSearch - A function that sets the search term based on user input.
 * @returns {JSX.Element} A React JSX element that displays the search bar.
 */
export default function Search({ setSearch }) {
  const searchRef = useRef(null);

  return (
    <div className="space-y-12 px-6 sm:px-10 md:px-14 lg:pr-0 xl:px-24 2xl:px-32">
      {/* Search Games section header */}
      <div className="space-y-2">
        <h1>Search Games</h1>
        <p>Find your next favorite game with our easy-to-use search tool. Browse through our extensive library and filter by platform, release date and more.</p>
      </div>
      {/* Search bar */}
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
  );
}
