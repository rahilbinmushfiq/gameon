export default function Filter({ filter, setFilter }) {
    return (
        <>
            <h3 className="text-xl mt-6 underline">Filter Games</h3>
            <div className="flex gap-10 mb-10">
                <label className="flex gap-2">
                    Platform:
                    <select className="border-2 border-neutral-900" onChange={(e) => setFilter(prevFilter => ({
                        ...prevFilter,
                        platform: e.target.value
                    }))}>
                        <option value="" selected={filter.platform === ""}>Any</option>
                        <option value="pc" selected={filter.platform === "pc"}>PC</option>
                        <option value="playstation" selected={filter.platform === "playstation"}>PlayStation</option>
                        <option value="xbox" selected={filter.platform === "xbox"}>Xbox</option>
                    </select>
                </label>
                <div className="flex gap-2">
                    Release Date:
                    {Object.entries(filter.releaseDates).map(([year, checked]) => (
                        <label key={year}>
                            <input type="checkbox" checked={checked} onChange={() => setFilter(prevFilter => ({
                                ...prevFilter,
                                releaseDates: { ...filter.releaseDates, [year]: !checked }
                            }))} />
                            {year}
                        </label>
                    ))}
                </div>
                <label className="flex gap-2">
                    Sort by:
                    <select className="border-2 border-neutral-900" onChange={(e) => setFilter(prevFilter => ({
                        ...prevFilter,
                        sort: e.target.value
                    }))}>
                        <option value="">---</option>
                        <option value="topRated">Top rated</option>
                        <option value="topScored">Top scored</option>
                        <option value="releaseDate">Release Date</option>
                    </select>
                </label>
            </div>
        </>
    )
}