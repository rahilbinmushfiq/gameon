import Image from "next/image";
import { getDateAndTime } from "../../utils/convertTimestamp";
import { FaArrowRight } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function Review({ reviewType, photoURL, name, postedOn, assessment, comment, articleLink }) {
  return (
    <div className="mx-6 p-4 rounded-sm space-y-3 bg-[#2f2f2f]">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image className="object-cover" src={photoURL} fill sizes="3rem" alt={`${reviewType === "user" ? "user" : "critic"}`} />
          </div>
          <div>
            <p className="text-[#dfdfdf] font-bold">{name}</p>
            <p className="text-xs text-[#9f9f9f]">{getDateAndTime(postedOn)}</p>
          </div>
        </div>
        <div>
          {reviewType === "critic" ? (
            <div className="flex justify-center items-center h-9 w-14 bg-[#e30e30] text-[#f1f1f1] font-semibold">
              <p>{assessment}</p>
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
      <div className="text-[#bfbfbf]">
        {comment}
      </div>
      {reviewType === "critic" && (
        <div className="inline-block">
          <a className="flex items-center gap-1 mt-4" href={articleLink} target="_blank" rel="noopener noreferrer">
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