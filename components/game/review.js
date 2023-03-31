import Image from "next/image";
import { getDateAndTime } from "../../utils/convertTimestamp";
import { FaArrowRight } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function Review({ reviewType, photoURL, name, postedOn, assessment, comment, articleLink }) {
  return (
    <div className="mx-6 p-4 rounded-sm space-y-3 bg-[#2f2f2f]">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#3f3f3f] ring-[3px] ring-[#a9a9a9]">
            <Image
              className="object-cover"
              src={photoURL}
              fill
              alt={reviewType}
            />
          </div>
          <div>
            <p className="text-[#dfdfdf] font-bold">{name}</p>
            <p className="text-xs text-[#9f9f9f]">{getDateAndTime(postedOn)}</p>
          </div>
        </div>
        <div>
          {reviewType === "critic" ? (
            <div className="h-9 w-14 flex justify-center items-center bg-[#e30e30]">
              <p className="text-[#f1f1f1] font-semibold">{assessment}</p>
            </div>
          ) : (
            <div className="flex gap-[1px]">
              {[1, 2, 3, 4, 5].map((value) => (
                assessment >= value ? (
                  <FaStar key={value} size={15} color="#e30e30" />
                ) : (
                  <FaRegStar key={value} size={15} color="#e30e30" />
                )
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-[#bfbfbf]">
        {comment}
      </p>
      {reviewType === "critic" && (
        <div className="inline-block">
          <a className="flex items-center gap-1 mt-4 hover:underline" href={articleLink} target="_blank" rel="noopener noreferrer">
            <p className="text-xs font-bold text-[#dfdfdf]">
              Read full article
            </p>
            <FaArrowRight size={10} color="#dfdfdf" />
          </a>
        </div>
      )}
    </div>
  )
}