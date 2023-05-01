import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { IoMenuOutline, IoHomeOutline, IoGameControllerOutline, IoPersonOutline, IoLogInOutline, IoLogOutOutline } from "react-icons/io5"
import { auth } from "../../config/firebase";
import { useAuth } from "../../contexts/auth";
import { useLoading } from "../../contexts/loading";
import logo from "../../public/logo.svg";

/*
 * Renders a responsive navbar component that either displays a navigation bar, or a button that opens the navigation menu. It includes dynamic navigation links depending on the user authentication state.
 * If users are authenticated and authorized, the component renders homepage, search games page, and account page links and a button for signing out.
 * Otherwise, the component renders a link to sign-in page, along with the usual links to homepage and search games page.
 * 
 * @returns {JSX.Element} A JSX element that displays the navbar section on every page.
 */
export default function Navbar() {
  const { user } = useAuth(); // Retrieve current user from Auth context
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const { asPath } = useRouter();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State hook for keeping track whether to show/hide the navbar menu on smaller devices

  // Function to sign the user out
  const userSignOut = async () => {
    setIsPageLoading(true); // Set page loading state to true to show loading spinner

    try {
      await signOut(auth);
      toast.success("Successfully signed out.");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }

    setIsPageLoading(false); // Set page loading state to false to hide loading spinner
  };

  return (
    <header className="px-6 py-3 sm:px-10 sm:py-5 md:px-14 md:py-7 xl:px-24 2xl:px-32">
      <nav>
        {/* Navbar toggle button for smaller devices */}
        <button
          className="md:hidden"
          onClick={() => setIsNavbarOpen(prevState => !prevState)}
        >
          <IoMenuOutline className="text-[30px] sm:text-[36px]" color="#f1f1f1" />
        </button>
        {/* Navbar background */}
        <div
          className={`fixed inset-0 z-[1] w-screen h-screen bg-[#3f3f3f] bg-opacity-25 backdrop-blur ${isNavbarOpen ? "" : "hidden"} md:block md:static md:w-full md:h-fit`}
          id="navbar-bg"
          onClick={(event) => event.target.id === "navbar-bg" && setIsNavbarOpen(prevState => !prevState)}
        >
          {/* Navbar container */}
          <div className="w-3/5 h-screen space-y-10 p-6 rounded-r-[1rem] bg-[#1f1f1f] sm:w-2/5 md:w-full md:h-12 md:p-0 md:flex md:justify-between md:items-center md:space-y-0 md:rounded-r-none">
            <div className="inline-block">
              {/* Game On logo with link to homepage */}
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
            {/* Navigation links */}
            <ul className="flex flex-col gap-2 md:flex-row md:gap-x-10 xl:gap-x-12">
              {/* Homepage link */}
              <Link href="/" onClick={() => setIsNavbarOpen(false)}>
                <li className={`nav--li ${asPath === "/" ? "active-nav" : "inactive-nav"}`}>
                  <IoHomeOutline size={20} />
                  <p>Home</p>
                </li>
              </Link>
              {/* Search Games page link */}
              <Link href="/search-games" onClick={() => setIsNavbarOpen(false)}>
                <li className={`nav--li ${asPath === "/search-games" ? "active-nav" : "inactive-nav"}`}>
                  <IoGameControllerOutline size={20} />
                  <p>Games</p>
                </li>
              </Link>
              { // Check user authentication and their email verification status
                (!user || (user && !user.emailVerified)) ? (
                  // If user is not authenticated or their email is not verified yet
                  // Sign-in page link
                  <Link href="/signin" onClick={() => setIsNavbarOpen(false)}>
                    <li className={`nav--li ${asPath === "/signin" ? "active-nav" : "inactive-nav"}`}>
                      <IoLogInOutline size={20} />
                      <p>Sign in</p>
                    </li>
                  </Link>
                ) : (
                  // If user is authenticated and their email is verified
                  <>
                    {/* Account page link */}
                    <Link href="/account" onClick={() => setIsNavbarOpen(false)}>
                      <li className={`nav--li ${asPath === "/account" ? "active-nav" : "inactive-nav"}`}>
                        <IoPersonOutline size={20} />
                        <p>Account</p>
                      </li>
                    </Link>
                    {/* Sign out button */}
                    <li
                      className="nav--li cursor-pointer [&>p]:font-semibold [&>*]:text-[#9f9f9f] md:primary-btn md:primary-btn--hover md:px-5 md:border-none md:rounded-sm"
                      onClick={userSignOut}
                    >
                      <IoLogOutOutline size={20} />
                      <p>Sign out</p>
                    </li>
                  </>
                )
              }
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
