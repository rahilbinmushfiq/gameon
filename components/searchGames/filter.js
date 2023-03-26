import { IoFilterOutline } from "react-icons/io5";

export default function Filter({ filter, setFilter }) {
  return (
    <>
      <div className="space-y-6 bg-[#1f1f1f] mx-6 p-4">
        <div className="flex items-center gap-2">
          <IoFilterOutline size={18} color="#f1f1f1" />
          <h2 className="text-base font-semibold text-[#bfbfbf]">Filter Results</h2>
        </div>
        <label className="search--label">
          <p className="font-semibold w-14 text-[#a9a9a9]">Platform:</p>
          <select
            className="bg-[#1f1f1f] h-12 flex-grow text-xs text-[#a9a9a9] px-3 rounded-sm border border-[#353535] focus:outline-none focus:border focus:border-[#e30e30]/60"
            value={filter.platform}
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              platform: e.target.value
            }))}
          >
            <option value="">Any</option>
            <option value="pc">PC</option>
            <option value="playstation">PlayStation</option>
            <option value="xbox">Xbox</option>
          </select>
        </label>
        <label className="search--label">
          <p className="font-semibold w-14 text-[#a9a9a9]">Sort by:</p>
          <select
            className="bg-[#1f1f1f] h-12 flex-grow text-xs text-[#a9a9a9] px-3 rounded-sm border border-[#353535] focus:outline-none focus:border focus:border-[#e30e30]/60"
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              sort: e.target.value
            }))}
          >
            <option value="">---</option>
            <option value="topRated">Top rated</option>
            <option value="topScored">Top scored</option>
            <option value="releaseDate">Release Date</option>
          </select>
        </label>
        <div className="search--label">
          <p className="font-semibold w-14 text-[#a9a9a9]">Release Date:</p>
          <div className="flex-grow grid grid-cols-3 gap-2">
            {Object.entries(filter.releaseDates).map(([year, checked]) => (
              <label key={year} className="flex gap-1 justify-center items-center">
                <input
                  className="h-4 w-4 accent-[#f1f1f1]"
                  type="checkbox"
                  checked={checked}
                  onChange={() => setFilter(prevFilter => ({
                    ...prevFilter,
                    releaseDates: { ...filter.releaseDates, [year]: !checked }
                  }))}
                />
                <p className="text-xs text-[#a9a9a9]">{year}</p>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}