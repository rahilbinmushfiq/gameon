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
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-bold">Average user rating <span className="font-semibold">(out of 5)</span>:</h4>
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
            <h4 className="font-bold">Average critic score <span className="font-semibold">(out of 50)</span>:</h4>
            <div className="p-3 bg-[#e30e30] text-[#f1f1f1] font-semibold inline-block">
              {averageScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}