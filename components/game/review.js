import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa";
import { getDateAndTime } from "../../utils/convertTimestamp";

/*
 * The Review component displays a review for a game, utilized by the userReviews and criticReviews components to render the list of reviews. It includes the reviewer's name, photo, and posted date, the user rating or critic score, the review comment, and a link to the critic's blog post (if this is a critic review).
 * 
 * @param {string} reviewType - The type of review, either 'user' or 'critic'.
 * @param {string} photoURL - The URL of the reviewer's profile photo.
 * @param {string} name - The name of the reviewer.
 * @param {firebase.firestore.Timestamp} postedOn - The time and date when the review was posted.
 * @param {number} assessment - The rating or score given by the reviewer.
 * @param {string} comment - The comment given in the review.
 * @param {string|undefined} articleLink - The URL of the critic's blog post, or undefined for user review.
 * 
 * @returns {JSX.Element} A React JSX element that renders a user review or critic review.
 */
export default function Review({ reviewType, photoURL, name, postedOn, assessment, comment, articleLink }) {
  return (
    /* Review container */
    <div className="space-y-6 p-4 mx-6 rounded-sm bg-[#2f2f2f] sm:mx-10 sm:p-6 md:mx-14 xl:mx-24 2xl:mx-32">
      <div className="flex justify-between">
        {/* Display reviewer name, photo and posted date */}
        <div className="flex gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#3f3f3f] ring-[3px] ring-[#a9a9a9]">
            <Image
              className="absolute w-full h-full object-cover"
              src={photoURL}
              alt={reviewType}
              width={0}
              height={0}
              sizes="25vw"
            />
          </div>
          <div className="space-y-1">
            <p className={`${name === "Deleted User" ? "italic" : "font-semibold"} leading-none text-[#dfdfdf] sm:text-xl sm:leading-none`}>
              {name}
            </p>
            <p className="text-sm text-[#9f9f9f]">
              {getDateAndTime(postedOn)}
            </p>
          </div>
        </div>
        <div>
          {// Check the review type
            reviewType === "critic" ? (
              // If this is a critic review, display the critic score as number in a container
              <div className="h-9 w-14 flex justify-center items-center bg-[#e30e30]">
                <p className="font-semibold text-[#f1f1f1]">{assessment}</p>
              </div>
            ) : (
              // If this is a user review, display the user rating as stars
              <div className="flex gap-[1px] [&>svg]:text-[15px] sm:[&>svg]:text-[18px]">
                {[1, 2, 3, 4, 5].map((value) => (
                  assessment >= value ? (
                    <FaStar key={value} color="#e30e30" /> // Filled star icon
                  ) : (
                    <FaRegStar key={value} color="#e30e30" /> // Empty star icon
                  )
                ))}
              </div>
            )
          }
        </div>
      </div>
      {/* Review comment */}
      <p className="whitespace-pre-wrap text-[#bfbfbf]">
        {comment}
      </p>
      {// If this is a critic review, render a button to view the critic's blog post
        reviewType === "critic" && (
          <button>
            <a
              className="font-bold text-sm text-[#f1f1f1]/[0.8] hover:text-[#f1f1f1]"
              href={articleLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Blog Post
            </a>
          </button>
        )
      }
    </div>
  );
}
