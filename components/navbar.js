import { auth } from "../config/firebase";
import Link from "next/link";
import { useAuth } from "../contexts/auth";
import { useLoading } from "../contexts/loading";
import { useState } from "react";
import { useRouter } from "next/router";
import { IoMenuOutline, IoHomeOutline, IoGameControllerOutline, IoPersonOutline, IoLogInOutline, IoLogOutOutline } from "react-icons/io5"
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import Image from "next/image";
import logo from "../public/logo.png";

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
    <header className="px-6 py-3 h-14">
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
            <div className="w-3/5 h-screen p-6 bg-[#1f1f1f] rounded-r-[1rem]">
              <div className="inline-block mb-10">
                <Link href="/" onClick={() => setIsNavbarOpen(false)}>
                  <Image src={logo} alt="game-on-logo" width={125} />
                </Link>
              </div>
              <ul className="flex flex-col gap-2">
                <Link href="/" onClick={() => setIsNavbarOpen(false)}>
                  <li className="nav--li">
                    <IoHomeOutline
                      size={20}
                      color={`${asPath === "/" ? "#f1f1f1" : "#9f9f9f"}`}
                    />
                    <p className={`${asPath === "/" ? "font-bold text-[#f1f1f1]" : "font-semibold text-[#9f9f9f]"}`}>
                      Home
                    </p>
                  </li>
                </Link>
                <Link href="/search-games" onClick={() => setIsNavbarOpen(false)}>
                  <li className="nav--li">
                    <IoGameControllerOutline
                      size={20}
                      color={`${asPath === "/search-games" ? "#f1f1f1" : "#9f9f9f"}`}
                    />
                    <p className={`${asPath === "/search-games" ? "font-bold text-[#f1f1f1]" : "font-semibold text-[#9f9f9f]"}`}>
                      Games
                    </p>
                  </li>
                </Link>
                {(!user || (user && !user.emailVerified)) && (
                  <Link href="/signin" onClick={() => setIsNavbarOpen(false)}>
                    <li className="nav--li">
                      <IoLogInOutline
                        size={20}
                        color={`${asPath === "/signin" ? "#f1f1f1" : "#9f9f9f"}`}
                      />
                      <p className={`${asPath === "/signin" ? "font-bold text-[#f1f1f1]" : "font-semibold text-[#9f9f9f]"}`}>
                        Sign in
                      </p>
                    </li>
                  </Link>
                )}
                {user && user.emailVerified && (
                  <>
                    <Link href="/account" onClick={() => setIsNavbarOpen(false)}>
                      <li className="nav--li">
                        <IoPersonOutline
                          size={20}
                          color={`${asPath === "/account" ? "#f1f1f1" : "#9f9f9f"}`}
                        />
                        <p className={`${asPath === "/account" ? "font-bold text-[#f1f1f1]" : "font-semibold text-[#9f9f9f]"}`}>
                          Account
                        </p>
                      </li>
                    </Link>
                    <li
                      className="nav--li cursor-pointer"
                      onClick={userSignOut}
                    >
                      <IoLogOutOutline
                        size={20}
                        color="#9f9f9f"
                      />
                      <p className="font-semibold text-[#9f9f9f]">
                        Sign out
                      </p>
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