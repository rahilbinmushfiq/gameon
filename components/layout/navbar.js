import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { IoMenuOutline, IoHomeOutline, IoGameControllerOutline, IoPersonOutline, IoLogInOutline, IoLogOutOutline } from "react-icons/io5"
import { auth } from "../../config/firebase";
import { useAuth } from "../../contexts/auth";
import { useLoading } from "../../contexts/loading";
import logo from "../../public/logo.svg";

export default function Navbar() {
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const { asPath } = useRouter();

  const userSignOut = async () => {
    setIsPageLoading(true);

    try {
      await signOut(auth);
      toast.success("Successfully signed out.");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }

    setIsPageLoading(false);
  }

  return (
    <header className="px-6 py-3 sm:px-10 sm:py-5 md:px-14 md:py-7">
      <nav>
        <button
          className="md:hidden"
          onClick={() => setIsNavbarOpen(prevState => !prevState)}
        >
          <IoMenuOutline className="text-[30px] sm:text-[36px]" color="#f1f1f1" />
        </button>
        <div
          className={`fixed inset-0 z-[1] w-screen h-screen bg-[#3f3f3f] bg-opacity-25 backdrop-blur ${isNavbarOpen ? "" : "hidden"} md:block md:static md:w-full md:h-fit`}
          id="navbar-bg"
          onClick={(event) => event.target.id === "navbar-bg" && setIsNavbarOpen(prevState => !prevState)}
        >
          <div className="w-3/5 h-screen space-y-10 p-6 rounded-r-[1rem] bg-[#1f1f1f] sm:w-2/5 md:visible md:w-full md:h-12 md:p-0 md:flex md:justify-between md:items-center md:space-y-0">
            <div className="inline-block">
              <Link href="/" onClick={() => setIsNavbarOpen(false)}>
                <div className="relative w-32 h-9">
                  <Image
                    className="absolute w-full h-full"
                    src={logo}
                    alt="game-on-logo"
                  />
                </div>
              </Link>
            </div>
            <ul className="flex flex-col gap-2 md:flex-row md:gap-10">
              <Link href="/" onClick={() => setIsNavbarOpen(false)}>
                <li className={`nav--li ${asPath === "/" ? "[&>*]:text-[#f1f1f1] [&>p]:font-bold md:border-[#e30e30]" : "[&>*]:text-[#9f9f9f] [&>p]:font-semibold"}`}>
                  <IoHomeOutline size={20} />
                  <p>Home</p>
                </li>
              </Link>
              <Link href="/search-games" onClick={() => setIsNavbarOpen(false)}>
                <li className={`nav--li ${asPath === "/search-games" ? "[&>*]:text-[#f1f1f1] [&>p]:font-bold md:border-[#e30e30]" : "[&>*]:text-[#9f9f9f] [&>p]:font-semibold"}`}>
                  <IoGameControllerOutline size={20} />
                  <p>Games</p>
                </li>
              </Link>
              {(!user || (user && !user.emailVerified)) && (
                <Link href="/signin" onClick={() => setIsNavbarOpen(false)}>
                  <li className={`nav--li ${asPath === "/signin" ? "[&>*]:text-[#f1f1f1] [&>p]:font-bold md:border-[#e30e30]" : "[&>*]:text-[#9f9f9f] [&>p]:font-semibold"}`}>
                    <IoLogInOutline size={20} />
                    <p>Sign in</p>
                  </li>
                </Link>
              )}
              {user && user.emailVerified && (
                <>
                  <Link href="/account" onClick={() => setIsNavbarOpen(false)}>
                    <li className={`nav--li ${asPath === "/account" ? "[&>*]:text-[#f1f1f1] [&>p]:font-bold md:border-[#e30e30]" : "[&>*]:text-[#9f9f9f] [&>p]:font-semibold"}`}>
                      <IoPersonOutline size={20} />
                      <p>Account</p>
                    </li>
                  </Link>
                  <li
                    className="nav--li cursor-pointer [&>*]:text-[#9f9f9f] [&>p]:font-semibold md:primary-btn md:primary-btn--hover md:border-none md:rounded-sm md:px-5"
                    onClick={userSignOut}
                  >
                    <IoLogOutOutline size={20} />
                    <p>Sign out</p>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}