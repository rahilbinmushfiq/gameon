import Image from "next/image";
import Link from "next/link";
import { getYear } from "../../utils/convertTimestamp";
import { sliceParagraph } from "../../utils/slice";

export default function GameCard({ game: { id, thumbnailURL, name, summary, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    <Link href={`/game/${id}`}>
      <div className="mb-6 grid grid-rows-2 gap-4 m-6 p-4 bg-[#353535]">
        <div className="relative rounded-sm overflow-hidden">
          <Image className="object-cover" src={thumbnailURL} fill sizes="10rem" alt={`${name} thumbnail`} />
        </div>
        <div className="space-y-4 text-[#cfcfcf]">
          <div>
            <h3 className="text-xl font-bold text-[#f1f1f1]">{name} <span className="font-semibold">({getYear(releaseDate)})</span></h3>
            <p className="font-semibold">{platforms.join(" • ")}</p>
          </div>
          <h4 className="text-xs">{sliceParagraph(summary)}</h4>
          <div className="py-1">
            <hr className="border-[#4a4a4a]" />
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="font-semibold">Average user rating:</p>
              <div className="relative text-[#a9a9a9] inline-block overflow-hidden">
                <div className="before:content-['\2605\2605\2605\2605\2605'] before:text-[20pt]" />
                <div
                  className="before:content-['\2605\2605\2605\2605\2605'] before:text-[20pt] absolute inset-0 text-[#e30e30] overflow-hidden"
                  style={{ width: `${averageRating * 20}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Average critic score:</p>
              <div className="px-3 py-3 bg-[#e30e30] text-[#f1f1f1] font-bold inline-block">
                {averageScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}