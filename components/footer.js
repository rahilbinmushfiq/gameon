import Image from "next/image";
import Link from "next/link";
import Logo from "../public/logo.svg";

export default function Footer() {
    return (
        <footer>
            <div>
                <Image
                    className="w-24 h-12"
                    src={Logo}
                    alt="gameon-footer-logo"
                />
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi nobis
                    veritatis quas quos natus qui ipsum optio eveniet? Facilis, beatae id
                    deleniti nihil ratione distinctio!
                </p>
            </div>
            <div>
                <Link href="/search-games"><h2>Search Games</h2></Link>
                <p>By platforms</p>
                <p>By year</p>
            </div>
            <div>
                <h2>Our Office</h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam, totam?
                </p>
            </div>
            <div>
                <h2>Contact Us</h2>
                <p>sample.email@gmail.com</p>
            </div>
        </footer>
    )
}