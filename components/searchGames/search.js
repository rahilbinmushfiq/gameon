export default function Search({ setSearch }) {
  return (
    <div className="pb-8 px-6 space-y-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold">SEARCH GAMES</h1>
        <p className="text-[#a9a9a9] leading-6">Find your next favorite game with our easy-to-use search tool. Browse through our extensive library and filter by platform, release date and more.</p>
      </div>
      <input
        className="w-full h-12 px-4 rounded-sm bg-[#1f1f1f] caret-[#f1f1f1] border border-[#4f4f4f] focus:outline-none focus:border focus:border-[#e30e30]/60 placeholder:text-[#9a9a9a]"
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)} />
    </div>
  )
}