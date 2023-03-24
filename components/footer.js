import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaDiscord, FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";
import logo from "../public/logo.png";

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
    <footer className="max-w-screen px-6 bg-[#2a2a2a] divide-y divide-[#4f4f4f]">
      <div className="py-10 space-y-12">
        <div className="space-y-2">
          <div className="inline-block">
            <Link href="/">
              <Image src={logo} width={150} alt="game-on-logo" />
            </Link>
          </div>
          <p className="text-[#9f9f9f] leading-6">
            With our easy-to-use rating system and detailed expert reviews from critics, you'll always know what to expect before making your next game purchase.
          </p>
          <div className="flex gap-4 pt-4">
            <a className="footer--a" href="https://www.discord.com" target="_blank" rel="noopener noreferrer">
              <FaDiscord size={20} color="#1f1f1f" />
            </a>
            <a className="footer--a" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookSquare size={20} color="#1f1f1f" />
            </a>
            <a className="footer--a" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitterSquare size={20} color="#1f1f1f" />
            </a>
          </div>
        </div>
        <div className="space-y-12 [&>*]:space-y-1">
          <div>
            <h2 className="font-bold tracking-wider">SEARCH GAMES</h2>
            <ul className="space-y-1">
              <li className="footer--li" onClick={() => handleSearchGames("pc")}>
                Available on PC
              </li>
              <li className="footer--li" onClick={() => handleSearchGames("playstation")}>
                Available on Playstaion
              </li>
              <li className="footer--li" onClick={() => handleSearchGames("xbox")}>
                Available on Xbox
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold tracking-wider">OUR OFFICE</h2>
            <p className="text-[#9f9f9f]">
              458 West Green Hill St., NC 27540
            </p>
          </div>
          <div>
            <h2 className="font-bold tracking-wider">CONTACT US</h2>
            <p className="text-[#9f9f9f]">game.on.official@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="max-w-screen pt-6 pb-4">
        <p className="text-[#dfdfdf] text-center text-xs">Copyright &copy; <span className="text-[#e30e30] font-bold">Game On</span> - 2023. All Rights Reserved</p>
      </div>
    </footer>
  )
}