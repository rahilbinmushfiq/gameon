import Logo from "../public/logo.png";
import { auth } from "../config/firebase";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../config/auth";

export default function Navbar() {
    const { user, isLoading } = useAuth();

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <header className="mb-2">
            <div className=" w-28 h-10 relative">
                <Image className="object-cover" src={Logo} fill sizes="200px" alt="gamon-logo" />
            </div>
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