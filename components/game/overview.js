import { getDate } from "../../utils/convertTimestamp";

export default function Overview({ overview: { summary, genres, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    <>
      <h2 className="text-2xl underline">Overview Tab</h2>
      <div className="flex gap-16">
        <div className="w-[35rem]">
          <h3 className="underline">Summary</h3>
          <p>{summary}</p>
        </div>
        <div>
          <h3 className="underline">About</h3>
          <div>
            <p>Genres: {genres.join(", ")}</p>
            <p>Platforms: {platforms.join(", ")}</p>
            <p>Release date: {getDate(releaseDate)}</p>
          </div>
        </div>
        <div>
          <h3 className="underline">Review</h3>
          <p>Average rating: {averageRating.toFixed(2)}</p>
          <p>Average score: {averageScore.toFixed(1)}</p>
        </div>
      </div>
    </>
  );
}