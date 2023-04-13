import { MdFilterAlt, MdLoop } from "react-icons/md";

export default function Filter({ filter, setFilter }) {
  return (
    <div className="space-y-6 mx-6 p-4 bg-[#1f1f1f] sm:mx-10 sm:p-6 md:mx-14 md:space-y-10 lg:mr-0 xl:ml-0 xl:bg-[#2f2f2f] xl:divide-y-2 xl:divide-[#3f3f3f] xl:space-y-0 xl:sticky">
      <div className="flex items-center gap-2 [&>*]:text-[#bfbfbf] xl:pb-4">
        <MdFilterAlt size={18} />
        <h2 className="text-lg font-semibold">
          Filter Results
        </h2>
      </div>
      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-6 md:gap-x-16 md:gap-y-8 xl:grid-cols-1 xl:pt-4">
        <div className="filter-container md:col-span-3 xl:col-span-1">
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
        <div className="filter-container md:col-span-3 xl:col-span-1">
          <label>Sort by:</label>
          <select
            value={filter.sort}
            onChange={(e) => setFilter(prevFilter => ({
              ...prevFilter,
              sort: e.target.value
            }))}
          >
            <option value="">Default</option>
            <option value="topRated">Top rated</option>
            <option value="topScored">Top scored</option>
            <option value="releaseDate">Release Date</option>
          </select>
        </div>
        <div className="filter-container md:col-span-4 xl:items-start xl:col-span-1">
          <label>Release Date:</label>
          <div className="grid grid-cols-3 gap-y-3 sm:grid-cols-none sm:grid-flow-col sm:auto-cols-max sm:gap-x-6 md:gap-x-4 xl:grid-cols-3 xl:grid-flow-row xl:gap-y-4">
            {Object.entries(filter.releaseDates).map(([year, checked]) => (
              <div key={year} className="flex items-center gap-[6px] sm:gap-1 xl:gap-[6px]">
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
        <div className="pt-6 md:pt-0 flex justify-end md:col-span-2 xl:col-span-1">
          <button
            className="border border-[#a9a9a9] text-[#a9a9a9] [&>*]:hover:text-[#1f1f1f] hover:bg-[#f1f1f1] hover:border-[#f1f1f1] h-12 w-full"
            onClick={() => setFilter({
              sort: "",
              platform: "",
              releaseDates: {
                "2019": false,
                "2020": false,
                "2021": false,
                "2022": false,
                "2023": false
              }
            })}
          >
            <MdLoop size={16} />
            <p>Reset Filter</p>
          </button>
        </div>
      </div>
    </div>
  )
}