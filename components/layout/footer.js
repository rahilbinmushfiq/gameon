import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaDiscord, FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";
import logo from "../../public/logo.svg";

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
    <footer className="px-6 bg-[#2a2a2a] divide-y divide-[#4f4f4f] sm:px-10 md:px-14 xl:px-24 2xl:px-32">
      <div className="py-24 space-y-12 md:space-y-0 md:flex md:justify-between 2xl:pt-36">
        <div className="space-y-10 md:basis-2/5 lg:basis-[27.5%]">
          <div className="space-y-2">
            <div className="inline-block">
              <Link href="/">
                <div className="relative w-36 h-10">
                  <Image
                    className="absolute w-full h-full"
                    src={logo}
                    alt="game-on-logo"
                  />
                </div>
              </Link>
            </div>
            <p>With our easy-to-use rating system and detailed expert reviews from critics, you'll always know what to expect before making your next game purchase.</p>
          </div>
          <div className="flex gap-4 [&>a]:social-link">
            <a href="https://www.discord.com" target="_blank" rel="noopener noreferrer">
              <FaDiscord size={20} color="#1f1f1f" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookSquare size={20} color="#1f1f1f" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitterSquare size={20} color="#1f1f1f" />
            </a>
          </div>
        </div>
        <div className="footer--sub-section lg:basis-1/6">
          <h2>SEARCH GAMES</h2>
          <ul className="space-y-1 [&>li]:footer--li">
            <li onClick={() => handleSearchGames("pc")}>
              Available on PC
            </li>
            <li onClick={() => handleSearchGames("playstation")}>
              Available on Playstaion
            </li>
            <li onClick={() => handleSearchGames("xbox")}>
              Available on Xbox
            </li>
          </ul>
        </div>
        <div className="footer--sub-section lg:basis-1/6">
          <h2>OUR OFFICE</h2>
          <p>458 West Green Hill St., NC 27540</p>
        </div>
        <div className="footer--sub-section lg:basis-0">
          <h2>CONTACT US</h2>
          <p>game.on.official@gmail.com</p>
        </div>
      </div>
      <div className="py-6">
        <p className="text-[#dfdfdf] text-center text-sm">Copyright &copy; <span className="text-[#e30e30] font-bold">Game On</span> - 2023. All Rights Reserved</p>
      </div>
    </footer>
  )
}