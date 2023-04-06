import { IoFilterOutline } from "react-icons/io5";

export default function Filter({ filter, setFilter }) {
  return (
    <div className="space-y-6 mx-6 p-4 bg-[#1f1f1f]">
      <div className="flex items-center gap-2">
        <IoFilterOutline size={18} />
        <h2 className="text-lg font-semibold text-[#bfbfbf]">
          Filter Results
        </h2>
      </div>
      <div className="filter-container">
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
      <div className="filter-container">
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
      <div className="filter-container">
        <label>Release Date:</label>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(filter.releaseDates).map(([year, checked]) => (
            <div key={year} className="flex gap-[6px] items-center">
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
  )
}