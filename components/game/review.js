import Image from "next/image";
import { getDateAndTime } from "../../utils/convertTimestamp";

export default function Review({ reviewType, photoURL, name, postedOn, assessment, comment, articleLink }) {
  return (
    <div className="flex flex-col gap-1 m-2 p-2 bg-gray-100 w-fit">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="relative w-[3rem]">
            <Image className="object-cover rounded-full" src={photoURL} fill sizes="3rem" alt={`${reviewType === "critic" ? "user" : "critic"}`} />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p>{getDateAndTime(postedOn)}</p>
          </div>
        </div>
        <div>
          <p>{`${reviewType === "user" ? "Rating:" : "Score: "} ${assessment}`}</p>
        </div>
      </div>
      <div className="w-[50rem]">
        {comment}
      </div>
      {reviewType === "critic" && (
        <a className="border-2 w-fit p-1 bg-gray-800 text-white" href={articleLink} target="_blank" rel="noopener noreferrer">
          Read full review
        </a>
      )}
    </div>
  )
}