import Image from "next/image";
import { useRouter } from "next/router";
import Logo from "../public/logo.png";

export default function Footer() {
  const router = useRouter();

  const handleSearchGames = (platform) => {
    router.push({
      pathname: "/search-games",
      query: {
        platform: platform
      }
    }, "/search-games")
  }

  return (
    <footer className="flex gap-16">
      <div className="w-36 h-12 relative">
        <Image className="object-cover" src={Logo} fill sizes="200px" alt="gamon-logo" />
      </div>
      <div className="w-[15rem]">
        <h2 className="font-semibold">SEARCH GAMES</h2>
        <p className="cursor-pointer hover:bg-gray-100 w-fit" onClick={() => handleSearchGames("pc")}>
          Available on PC
        </p>
        <p className="cursor-pointer hover:bg-gray-100 w-fit" onClick={() => handleSearchGames("playstation")}>
          Available on Playstaion
        </p>
        <p className="cursor-pointer hover:bg-gray-100 w-fit" onClick={() => handleSearchGames("xbox")}>
          Available on Xbox
        </p>
      </div>
      <div className="w-[15rem]">
        <h2 className="font-semibold">OUR OFFICE</h2>
        <p>
          458 West Green Hill St. Holly Springs, NC 27540
        </p>
      </div>
      <div className="w-[15rem]">
        <h2 className="font-semibold">CONTACT US</h2>
        <p>game.on.official@gmail.com</p>
      </div>
    </footer>
  )
}