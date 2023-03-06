import Logo from "../public/logo.svg";
import { auth } from "../config/firebase";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../config/auth";

export default function Navbar() {
    const { user, isLoading } = useAuth();

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <header className="mb-2">
            <Image className="w-24 h-12" src={Logo} alt="gamon-logo" />
            <nav>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/search-games">Games</Link></li>
                    <li><Link href="/account">Account</Link></li>
                    {(!user || (user && !user.emailVerified)) && <li><Link href="/signin">Sign in</Link></li>}
                    {user && user.emailVerified && <li onClick={() => auth.signOut()}>Sign out</li>}
                </ul>
            </nav>
        </header>
    )
}