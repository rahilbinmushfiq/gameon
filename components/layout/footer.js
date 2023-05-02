import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaDiscord, FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";
import logo from "../../public/logo.svg";

/*
 * Renders a footer section that contains information about the website, search options for games, and contact information. It also includes website's social media links and copyright information.
 * 
 * @returns {JSX.Element} A JSX element that displays the footer section on every page.
 */
export default function Footer() {
  const router = useRouter();

  // Function to handle search games with a given platform
  const handleSearchGames = (platform) => {
    // Update the router object to navigate to the search games page with the given platform query parameter
    router.push({
      pathname: "/search-games",
      query: {
        platform: platform
      }
    }, "/search-games");
  };

  return (
    <footer className="px-6 bg-[#2a2a2a] divide-y divide-[#4f4f4f] sm:px-10 md:px-14 xl:px-24 2xl:px-32">
      {/* Footer main content */}
      <div className="py-24 space-y-12 md:space-y-0 md:flex md:justify-between 2xl:pt-36">
        {/* First subsection */}
        <div className="space-y-10 md:basis-0 lg:basis-[27.5%]">
          <div className="space-y-2">
            {/* Game On logo with link to homepage */}
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
            {/* Game On description */}
            <p>With our easy-to-use rating system and detailed expert reviews from critics, you&apos;ll always know what to expect before making your next game purchase.</p>
          </div>
          {/* Game On social media links */}
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
        {/* Second subsection for searching games */}
        <div className="footer--sub-section lg:basis-0 lg:whitespace-nowrap">
          <h2>SEARCH GAMES</h2>
          {/* List of clickable items to search games based on platform */}
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
        {/* Third subsection for Game On's office address */}
        <div className="footer--sub-section md:basis-1/6">
          <h2>OUR OFFICE</h2>
          <p>458 West Green Hill St., NC 27540</p>
        </div>
        {/* Fourth subsection for Game On's email address */}
        <div className="footer--sub-section lg:basis-0">
          <h2>CONTACT US</h2>
          <p>game.on.official@gmail.com</p>
        </div>
      </div>
      {/* Footer copyright content */}
      <div className="py-6">
        <p className="text-sm text-center text-[#dfdfdf]">Copyright &copy; <span className="font-bold text-[#e30e30]">Game On</span> - 2023. All Rights Reserved</p>
      </div>
    </footer>
  );
}
