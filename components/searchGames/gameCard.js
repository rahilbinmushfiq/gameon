import Image from "next/image";
import Link from "next/link";
import { getYear } from "../../utils/convertTimestamp";
import { sliceParagraph } from "../../utils/slice";

export default function GameCard({ game: { id, thumbnailURL, name, summary, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    <Link href={`/game/${id}`}>
      <div className="mb-6 grid grid-rows-2 gap-4 m-6 p-4 bg-[#353535]">
        <div className="relative rounded-sm overflow-hidden mr-4">
          <Image className="object-cover" src={thumbnailURL} fill sizes="10rem" alt={`${name} thumbnail`} />
        </div>
        <div className="space-y-4 text-[#cfcfcf]">
          <div>
            <h3 className="text-lg font-bold">{name} <span className="font-semibold">({getYear(releaseDate)})</span></h3>
            <p className="font-semibold">{platforms.join(" • ")}</p>
          </div>
          <h4 className="text-xs">{sliceParagraph(summary)}</h4>
          <div className="py-1">
            <hr className="border-[#4a4a4a]" />
          </div>
          <div>
            <p className="font-semibold">Average rating: {averageRating}/5</p>
            <p className="font-semibold">Average score: {averageScore}/50</p>
          </div>
        </div>
      </div>
    </Link>
  )
}