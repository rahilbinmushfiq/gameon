export default function Search({ setSearch }) {
    return (
        <>
            <h3 className="text-xl mt-6 underline">Search Games</h3>
            <input className="border-2 border-neutral-900 w-[20rem] mb-6" type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
        </>
    )
}