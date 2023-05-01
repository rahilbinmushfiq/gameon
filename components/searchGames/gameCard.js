import Image from "next/image";
import Link from "next/link";
import { getYear } from "../../utils/convertTimestamp";

/*
 * The Game Card component displays a card with a brief overview of a game, including the game's name, summary,  release date, platforms, average user rating, and average critic score. It also includes a thumbnail image of the game.
 * The 'search games' page utilizes this component to render the list of game cards.
 *
 * @param {number} index - The index of the game in the list.
 * @param {Object} game - An object containing information about the game.
 * @param {string} game.id - The unique ID of the game.
 * @param {string} game.thumbnailURL - The URL of the game's thumbnail image.
 * @param {string} game.name - The name of the game.
 * @param {string} game.summary - A brief summary of the game.
 * @param {Array} game.platforms - An array of strings representing the platforms the game is available on.
 * @param {firebase.firestore.Timestamp} game.releaseDate - The release date of the game.
 * @param {number} game.averageRating - The average user rating of the game.
 * @param {number} game.averageScore - The average critic score of the game.
 *
 * @returns {JSX.Element} A React JSX element that displays the game card component.
 */
export default function GameCard({ index, game: { id, thumbnailURL, name, summary, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    // Render the game card as a link to the Game Details page
    <Link href={`/game/${id}`}>
      {/* Game card container */}
      <div className={`grid grid-rows-2 gap-4 ${index === 0 ? "" : "my-6"} p-4 bg-[#2f2f2f] hover:bg-[#363636] transition-colors ease-in-out duration-300 sm:p-6 sm:grid-rows-none sm:grid-cols-2 sm:gap-6 md:grid-cols-5 xl:grid-cols-4`}>
        {/* Image segment */}
        <div className="relative rounded-sm overflow-hidden md:col-span-2 xl:col-span-1">
          {/* Game thumbnail */}
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
        {/* Text segment */}
        <div className="divide-y-2 divide-[#4a4a4a] md:col-span-3 xl:col-span-3">
          {/* Game details */}
          <div className="space-y-4 pb-6">
            <div className="space-y-1">
              {/* Game name and release date */}
              <h3 className="text-2xl font-bold text-[#f1f1f1]">
                {name} <span className="text-[#a9a9a9]">({getYear(releaseDate)})</span>
              </h3>
              {/* Game platforms */}
              <div className="flex flex-wrap gap-1">
                {platforms.map(platform => (
                  <p key={platform} className="p-2 rounded-sm font-semibold text-sm text-[#cfcfcf] bg-[#4a4a4a]">
                    {platform}
                  </p>
                ))}
              </div>
            </div>
            {/* Game summary */}
            <p className="line-clamp-3">{summary}</p>
          </div>
          {/* Game ratings */}
          <div className="space-y-3 pt-6 font-semibold text-[#cfcfcf]">
            {/* Average user rating */}
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
            {/* Average critic score */}
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
  );
}
