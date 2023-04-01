import { getDate } from "../../utils/convertTimestamp";

export default function Overview({ overview: { summary, genres, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    <section className="px-6 space-y-2 [&>div]:space-y-2 [&>div]:p-4 [&>div]:bg-[#2a2a2a] [&>div>h3]:text-lg [&>div>h3]:font-bold">
      <div>
        <h3>Summary</h3>
        <p>{summary}</p>
      </div>
      <div>
        <h3>About</h3>
        <div className="space-y-2 [&>p>span]:font-bold">
          <p><span>Genres:</span> {genres.join(", ")}</p>
          <p><span>Platforms:</span> {platforms.join(", ")}</p>
          <p><span>Release date:</span> {getDate(releaseDate)}</p>
        </div>
      </div>
      <div>
        <h3>Reviews</h3>
        <div className="space-y-4 [&>div>h4]:font-bold [&>div>h4]:text-[#a9a9a9] [&>div>h4>span]:font-semibold">
          <div className="space-y-1">
            <h4>Average user rating <span>(out of 5)</span>:</h4>
            <div className="flex items-center gap-2">
              <div className="rating-container">
                <div className="empty-stars" />
                <div
                  className="filled-stars"
                  style={{ width: `${averageRating * 20}%` }}
                />
              </div>
              <p className="font-bold">({averageRating.toFixed(2)})</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4>Average critic score <span>(out of 50)</span>:</h4>
            <div className="score">
              {averageScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}