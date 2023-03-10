import Link from "next/link";
import { useRouter } from "next/router";
import { FaDiscord, FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";

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
    <footer className="max-w-screen">
      <div className="p-6 space-y-12">
        <div className="space-y-2">
          <p className="text-3xl font-extrabold">
            <Link href="/">
              GAME <span className="text-[#e30e30]">ON</span>
            </Link>
          </p>
          <p className="text-[#9f9f9f]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla non massa id consequat. Mauris sed nulla quis urna hendrerit accumsan vitae sit amet nisi.
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
      <div className="max-w-screen px-6 py-3 bg-[#2f2f2f]">
        <p className="text-[#f1f1f1] text-center text-sm">Copyright &copy; <span className="text-[#e30e30]">Game On</span> - 2023. All Rights Reserved</p>
      </div>
    </footer>
  )
}