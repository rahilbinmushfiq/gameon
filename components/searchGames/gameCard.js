import Image from "next/image";
import Link from "next/link";
import { getYear } from "../../utils/convertTimestamp";
import { sliceParagraph } from "../../utils/slice";

export default function GameCard({ game: { id, thumbnailURL, name, summary, platforms, releaseDate, averageRating, averageScore } }) {
    return (
        <Link href={`/game/${id}`}>
            <div className="mb-6 flex bg-gray-100 m-2 p-4">
                <div className="relative w-[10rem] mr-4">
                    <Image className="object-cover" src={thumbnailURL} fill sizes="10rem" alt={`${name} thumbnail`} />
                </div>
                <div className="w-[25rem]">
                    <h3 className="text-2xl">{name}</h3>
                    <p className="mb-5">{platforms.join(" • ")} | {getYear(releaseDate)}</p>
                    <h4 className="mb-5">{sliceParagraph(summary)}</h4>
                    <p>Average rating: {averageRating}/5</p>
                    <p>Average score: {averageScore}/50</p>
                </div>
            </div>
        </Link>
    )
}