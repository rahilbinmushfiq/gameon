import Image from "next/image";
import Link from "next/link";
import { getYear } from "../../utils/convertTimestamp";
import { sliceParagraph } from "../../utils/slice";

export default function GameCard({ game: { id, thumbnailURL, name, summary, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    <Link href={`/game/${id}`}>
      <div className="grid grid-rows-2 gap-4 my-6 p-4 bg-[#2f2f2f]">
        <div className="relative rounded-sm overflow-hidden">
          <Image
            className="object-cover"
            src={thumbnailURL}
            fill
            alt={`${name} thumbnail`}
          />
        </div>
        <div className="divide-y-2 divide-[#4a4a4a]">
          <div className="space-y-4 pb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#f1f1f1]">
                {name} <span className="text-[#a9a9a9]">({getYear(releaseDate)})</span>
              </h3>
              <div className="flex flex-wrap gap-1">
                {platforms.map(platform => (
                  <p key={platform} className="p-2 rounded-sm font-semibold text-xs text-[#cfcfcf] bg-[#4a4a4a]">
                    {platform}
                  </p>
                )
                )}
              </div>
            </div>
            <p>{sliceParagraph(summary)}</p>
          </div>
          <div className="space-y-3 pt-6 font-semibold text-[#cfcfcf]">
            <div className="space-y-1">
              <h4>Average User Rating:</h4>
              <div className="rating-container">
                <div className="empty-stars" />
                <div
                  className="filled-stars"
                  style={{ width: `${averageRating * 20}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4>Average Critic Score:</h4>
              <div className="score">
                {averageScore ? averageScore.toFixed(1) : "0.0"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}