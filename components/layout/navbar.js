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
import logo from "../../public/logo.png";

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
    <header className="h-14 px-6 py-3">
      <nav>
        <button
          onClick={() => setIsNavbarOpen(prevState => !prevState)}
        >
          <IoMenuOutline size={30} color="#f1f1f1" />
        </button>
        {isNavbarOpen && (
          <div
            className="fixed inset-0 z-[1] w-screen h-screen bg-[#3f3f3f] bg-opacity-25 backdrop-blur"
            id="navbar-bg"
            onClick={(event) => event.target.id === "navbar-bg" && setIsNavbarOpen(prevState => !prevState)}
          >
            <div className="w-3/5 h-screen space-y-10 p-6 rounded-r-[1rem] bg-[#1f1f1f]">
              <div className="inline-block">
                <Link href="/" onClick={() => setIsNavbarOpen(false)}>
                  <Image src={logo} alt="game-on-logo" width={125} />
                </Link>
              </div>
              <ul className="flex flex-col gap-2">
                <Link href="/" onClick={() => setIsNavbarOpen(false)}>
                  <li className={`nav--li ${asPath === "/" ? "[&>*]:text-[#f1f1f1] [&>p]:font-bold" : "[&>*]:text-[#9f9f9f] [&>p]:font-semibold"}`}>
                    <IoHomeOutline size={20} />
                    <p>Home</p>
                  </li>
                </Link>
                <Link href="/search-games" onClick={() => setIsNavbarOpen(false)}>
                  <li className={`nav--li ${asPath === "/search-games" ? "[&>*]:text-[#f1f1f1] [&>p]:font-bold" : "[&>*]:text-[#9f9f9f] [&>p]:font-semibold"}`}>
                    <IoGameControllerOutline size={20} />
                    <p>Games</p>
                  </li>
                </Link>
                {(!user || (user && !user.emailVerified)) && (
                  <Link href="/signin" onClick={() => setIsNavbarOpen(false)}>
                    <li className={`nav--li ${asPath === "/signin" ? "[&>*]:text-[#f1f1f1] [&>p]:font-bold" : "[&>*]:text-[#9f9f9f] [&>p]:font-semibold"}`}>
                      <IoLogInOutline size={20} />
                      <p>Sign in</p>
                    </li>
                  </Link>
                )}
                {user && user.emailVerified && (
                  <>
                    <Link href="/account" onClick={() => setIsNavbarOpen(false)}>
                      <li className={`nav--li ${asPath === "/account" ? "[&>*]:text-[#f1f1f1] [&>p]:font-bold" : "[&>*]:text-[#9f9f9f] [&>p]:font-semibold"}`}>
                        <IoPersonOutline size={20} />
                        <p>Account</p>
                      </li>
                    </Link>
                    <li
                      className="nav--li cursor-pointer [&>*]:text-[#9f9f9f] [&>p]:font-semibold"
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
        )}
      </nav>
    </header>
  )
}