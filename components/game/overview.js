import { getDate } from "../../utils/convertTimestamp";

export default function Overview({ overview: { summary, genres, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    <section className="px-6 space-y-4">
      <div className="p-4 bg-[#2a2a2a] space-y-2">
        <h3 className="text-lg font-bold">Summary</h3>
        <p className="text-[#a9a9a9]">{summary}</p>
      </div>
      <div className="p-4 bg-[#2a2a2a] space-y-2">
        <h3 className="text-lg font-bold">About</h3>
        <div className="space-y-3">
          <p className="text-[#a9a9a9]"><span className="font-bold">Genres:</span> {genres.join(", ")}</p>
          <p className="text-[#a9a9a9]"><span className="font-bold">Platforms:</span> {platforms.join(", ")}</p>
          <p className="text-[#a9a9a9]"><span className="font-bold">Release date:</span> {getDate(releaseDate)}</p>
        </div>
      </div>
      <div className="p-4 bg-[#2a2a2a] space-y-1">
        <h3 className="text-lg font-bold">Reviews</h3>
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="font-bold text-[#a9a9a9]">Average user rating <span className="font-semibold">(out of 5)</span>:</p>
            <div className="flex items-center gap-2">
              <div className="relative text-[#a9a9a9] inline-block overflow-hidden">
                <div className="before:content-['\2605\2605\2605\2605\2605'] before:text-[18pt]" />
                <div
                  className="before:content-['\2605\2605\2605\2605\2605'] before:text-[18pt] absolute inset-0 text-[#e30e30] overflow-hidden"
                  style={{ width: `${averageRating * 20}%` }}
                />
              </div>
              <p className="text-[#a9a9a9] font-semibold">({averageRating})</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-[#a9a9a9]">Average critic score <span className="font-semibold">(out of 50)</span>:</p>
            <div className="p-3 bg-[#e30e30] text-[#f1f1f1] font-semibold inline-block">
              {averageScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}