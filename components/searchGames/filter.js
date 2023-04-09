import { IoFilterOutline } from "react-icons/io5";

export default function Filter({ filter, setFilter }) {
  return (
    <div className="space-y-6 mx-6 p-4 bg-[#1f1f1f] sm:mx-10 sm:p-6 md:mx-14 md:p-8 md:space-y-10">
      <div className="flex items-center gap-2">
        <IoFilterOutline size={18} />
        <h2 className="text-lg font-semibold text-[#bfbfbf]">
          Filter Results
        </h2>
      </div>
      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-8">
        <div className="filter-container col-span-1">
          <label>Platform:</label>
          <select
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
        </div>
        <div className="filter-container col-span-1">
          <label>Sort by:</label>
          <select
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
        </div>
        <div className="filter-container col-span-2">
          <label>Release Date:</label>
          <div className="grid grid-cols-3 gap-y-3 sm:grid-cols-none sm:grid-flow-col sm:auto-cols-max sm:gap-x-6">
            {Object.entries(filter.releaseDates).map(([year, checked]) => (
              <div key={year} className="flex items-center gap-[6px] sm:gap-1">
                <input
                  className="h-4 w-4 accent-[#f1f1f1]"
                  type="checkbox"
                  checked={checked}
                  onChange={() => setFilter(prevFilter => ({
                    ...prevFilter,
                    releaseDates: { ...filter.releaseDates, [year]: !checked }
                  }))}
                />
                <label className="text-sm text-[#a9a9a9]">{year}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}