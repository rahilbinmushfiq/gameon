import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaUserTie, FaCommentDots, FaArrowRight } from "react-icons/fa";
import { IoStopwatchSharp, IoGameController } from "react-icons/io5";
import hero from "../public/hero.jpg";
import community from "../public/community-controller.jpg";

/*
 * The Home component is the landing page of the Game On website. It contains the hero section with the website header, an image and call-to-actions that encourage users to explore the site or sign up, the features section that highlights the benefits of using the site, and the community section with an image and a final call-to-action button that encourages users to join the community.
 *
 * @returns {JSX.Element} A React JSX element that displays the homepage.
 */
export default function Home() {
  const socialProofs = {
    "12K+": "Games",
    "20K+": "Users",
    "10K+": "Reviews"
  };

  return (
    <main>
      <Head>
        <title>Game On</title>
      </Head>
      {/* --Hero section-- */}
      <section className="min-h-[calc(100vh_-_54px)] flex flex-col sm:min-h-[calc(100vh_-_76px)] md:min-h-[calc(100vh_-_6.5rem)] lg:grid lg:grid-cols-7">
        {/* Hero image container */}
        <div className="relative grow bg-[#e30e30]/[.8] lg:order-2 lg:col-span-4">
          {/* Hero section image */}
          <Image
            className="object-cover mix-blend-hard-light"
            src={hero}
            alt="hero-image"
            fill
            sizes="3072px"
            priority
          />
          {/* Add a gradient overlay over hero image */}
          <div className="absolute inset-0 h-full">
            <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
            <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#1f1f1f]" />
          </div>
          {/* Add a gradient overlay only for larger screens on the left side of hero image */}
          <div className="hidden absolute inset-0 h-full lg:block">
            <div className="absolute inset-0 h-full w-1/3 bg-gradient-to-r from-[#1f1f1f] via-transparent to-transparent" />
            <div className="h-full w-1/2 bg-gradient-to-r from-[#1f1f1f] via-transparent to-transparent" />
          </div>
        </div>
        {/* Hero section main content */}
        <div className="px-6 py-16 space-y-16 sm:px-10 md:px-14 lg:order-1 lg:col-span-3 lg:flex lg:flex-col lg:justify-center lg:pr-0 xl:px-24 2xl:pl-32">
          <div className="space-y-6">
            <h1 className="m-0 font-semibold text-[44px] leading-[52px] after:content-none min-[1111px]:text-5xl min-[1111px]:leading-[56px] min-[1325px]:text-[54px] min-[1325px]:leading-[58px] 2xl:text-6xl 2xl:leading-[68px] min-[1700px]:text-7xl min-[1700px]:leading-[80px]">
              Get the <span className="text-[#e30e30] font-bold">Ultimate</span> <br className="hidden lg:inline" />Gaming Experience
            </h1>
            <p>Whether you're a seasoned gamer or a newcomer to the scene, we've got you covered. We'll always make sure that you'll know what to expect before making your next game purchase.</p>
          </div>
          <div className="flex gap-6 [&>*>button]:font-bold [&>*>button]:w-32 [&>*>button]:h-12">
            <Link href="/search-games">
              <button className="primary-btn primary-btn--hover">
                Explore
              </button>
            </Link>
            <Link href="/signin">
              <button className="border border-[#f1f1f1] text-[#f1f1f1] hover:text-[#1f1f1f] hover:bg-[#f1f1f1]">
                Join us
              </button>
            </Link>
          </div>
        </div>
      </section>
      {/* --Features section-- */}
      <section className="grid grid-cols-2 gap-y-24 gap-x-12 px-6 py-32 bg-[#2a2a2a] [&>div]:card-container sm:px-10 sm:gap-x-20 md:px-14 md:gap-x-24 lg:grid-cols-4 xl:px-24 xl:py-44 2xl:px-32 2xl:py-60">
        <div>
          <IoStopwatchSharp size={30} color="#e30e30" />
          <h3>Time Saver</h3>
          <p>Save time and find the best games with ease by using our efficient filtering tools.</p>
        </div>
        <div>
          <FaUserTie size={30} color="#e30e30" />
          <h3>Expert Analysis</h3>
          <p>Get the in-depth analysis of each game from expert critics before you buy any game.</p>
        </div>
        <div>
          <FaCommentDots size={30} color="#e30e30" />
          <h3>User Feedbacks</h3>
          <p>Our user feedbacks section offers insights from real gamers to help you choose the right game.</p>
        </div>
        <div>
          <IoGameController size={30} color="#e30e30" />
          <h3>Diverse Games</h3>
          <p>Brwose through the diverse range of games to suit all interests and preferences.</p>
        </div>
      </section>
      {/* --Second CTA section-- */}
      <section className="px-6 py-32 sm:px-10 md:px-14 lg:grid lg:grid-cols-2 lg:gap-x-20 xl:px-24 xl:py-44 2xl:px-32 2xl:py-60">
        {/* Second CTA section main content */}
        <div className="space-y-12">
          {/* Main content heading */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              Join Our Community
            </h2>
            <p>Join our platform for free and take your gaming experience to the next level. It's time you become part of the most vibrant gaming community on the web. Share your opinions, connect with other gamers, and discover new titles to play.</p>
          </div>
          {/* CTA button */}
          <div className="inline-block">
            <Link href="/signin">
              <button className="primary-btn primary-btn--hover w-40 h-12">
                <p>Join for free</p>
                <FaArrowRight size={14} color="#f1f1f1" />
              </button>
            </Link>
          </div>
          {/* Social proofs */}
          <div className="flex gap-12 lg:gap-16">
            {Object.entries(socialProofs).map(([number, topic]) => (
              <div key={number}>
                <h4 className="text-3xl sm:text-4xl">{number}</h4>
                <p>{topic}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Second CTA section image container */}
        <div className="hidden relative h-full bg-[#e30e30]/[.9] lg:block">
          {/* Second CTA section image */}
          <Image
            className="object-cover mix-blend-darken"
            src={community}
            alt="community-alt"
            fill
            sizes="2048px"
          />
          {/* Add a gradient overlay over the image (vertical) */}
          <div className="absolute inset-0">
            <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
            <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#1f1f1f]" />
          </div>
          {/* Add a gradient overlay over the image (horizontal) */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 bg-gradient-to-r from-[#1f1f1f] via-transparent to-transparent" />
            <div className="w-1/2 bg-gradient-to-r from-transparent via-transparent to-[#1f1f1f]" />
          </div>
        </div>
      </section>
    </main>
  );
}
