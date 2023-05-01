import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { getDate } from "../../utils/convertTimestamp";

/*
 * Renders the Overview section of the Game Details page, which displays a summary and information about the game, as well as average ratings from users and critics. The component is rendered when users select the `Overview` tab on the Game Details page.
 * 
 * @param {Object} overview - The overview data for the game.
 * @param {string} overview.summary - A brief description of the game.
 * @param {Array<String>} overview.genres - The genres of the game.
 * @param {Array<String>} overview.platforms - The platforms the game is available on.
 * @param {firebase.firestore.Timestamp} overview.releaseDate - The release date of the game.
 * @param {number|null} overview.averageRating - The average rating of the game based on user reviews.
 * @param {number|null} overview.averageScore - The average score of the game based on critic reviews.
 * 
 * @returns {JSX.Element} A React JSX element that displays the Overview section of Game Details page.
 */
export default function Overview({ overview: { summary, genres, platforms, releaseDate, averageRating, averageScore } }) {
  return (
    /* --Overview section-- */
    <section className="px-6 pt-8 pb-20 space-y-2 [&>div]:space-y-2 [&>div]:p-4 [&>div]:bg-[#2f2f2f] [&>div>h3]:text-xl [&>div>h3]:font-bold sm:px-10 sm:[&>div]:p-6 md:px-14 md:grid md:grid-cols-2 md:space-y-0 md:gap-2 xl:px-24 xl:grid-cols-4 2xl:px-32">
      {/* --Summary subsection-- */}
      <div className="col-span-2">
        <h3>Summary</h3>
        <p>{summary}</p>
      </div>
      {/* --About subsection-- */}
      <div className="col-span-1">
        <h3>About</h3>
        <div className="space-y-2 [&>p>span]:font-bold">
          <p><span>Genres:</span> {genres.join(", ")}</p>
          <p><span>Platforms:</span> {platforms.join(", ")}</p>
          <p><span>Release date:</span> {getDate(releaseDate)}</p>
        </div>
      </div>
      {/* --Reviews subsection-- */}
      <div className="col-span-1">
        <h3>Reviews</h3>
        <div className="space-y-4 [&>div>h4]:font-bold [&>div>h4]:text-[#a9a9a9] [&>div>h4>span]:font-semibold">
          {/* Check if user reviews are available */
            averageRating ? (
              /* If user reviews are available, display average user rating */
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
            ) : (
              /* If user reviews are not available, display not unavailable message */
              <div className="flex items-center gap-2">
                <BsFillExclamationTriangleFill size={16} color="#a9a9a9" />
                <p>No user reviews available</p>
              </div>
            )
          }
          {/* Check if critic reviews are available */
            averageScore ? (
              /* If critic reviews are available, display average critic socre */
              <div className="space-y-2">
                <h4>Average critic score <span>(out of 50)</span>:</h4>
                <div className="score">
                  {averageScore.toFixed(1)}
                </div>
              </div>
            ) : (
              /* If user reviews are not available, display not unavailable message */
              <div className="flex items-center gap-2">
                <BsFillExclamationTriangleFill size={16} color="#a9a9a9" />
                <p>No critic reviews available</p>
              </div>
            )
          }
        </div>
      </div>
    </section>
  );
}
