import Image from "next/image";
import Link from "next/link";
import { getYear } from "../../utils/convertTimestamp";

export default function GameCard({ index, game: { id, thumbnailURL, name, summary, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    <Link href={`/game/${id}`}>
      <div className={`grid grid-rows-2 gap-4 ${index === 0 ? "" : "my-6"} p-4 bg-[#2f2f2f] hover:bg-[#363636] transition-colors ease-in-out duration-300 sm:p-6 sm:grid-rows-none sm:grid-cols-2 sm:gap-6 md:grid-cols-5 xl:grid-cols-4`}>
        <div className="relative rounded-sm overflow-hidden md:col-span-2 xl:col-span-1">
          <Image
            className="absolute w-full h-full object-cover"
            src={thumbnailURL}
            alt={`${name} thumbnail`}
            width={0}
            height={0}
            sizes="50vh"
            priority={index === 0}
          />
        </div>
        <div className="divide-y-2 divide-[#4a4a4a] md:col-span-3 xl:col-span-3">
          <div className="space-y-4 pb-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-[#f1f1f1]">
                {name} <span className="text-[#a9a9a9]">({getYear(releaseDate)})</span>
              </h3>
              <div className="flex flex-wrap gap-1">
                {platforms.map(platform => (
                  <p key={platform} className="p-2 rounded-sm font-semibold text-sm text-[#cfcfcf] bg-[#4a4a4a]">
                    {platform}
                  </p>
                )
                )}
              </div>
            </div>
            <p className="line-clamp-3">{summary}</p>
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