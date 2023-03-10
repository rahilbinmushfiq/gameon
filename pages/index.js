import Image from "next/image";
import hero from "../public/hero.jpg";

export default function Home() {
  return (
    <main>
      <div className="max-w-screen h-[21rem] bg-[#e30e30]/[.8] relative">
        <Image
          className="object-cover mix-blend-hard-light"
          src={hero}
          alt="hero-image"
          fill
          sizes="640px"
        />
        <div className="absolute h-full inset-0">
          <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
          <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#1f1f1f]" />
        </div>
      </div>
      <section className="max-w-screen p-6 space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold">
            Get the <span className="text-[#e30e30] font-bold">Ultimate</span> <br /> Gaming Experience
          </h1>
          <p className="text-[#b9b9b9] leading-7">
            Whether you're a seasoned gamer or a newcomer to the scene, we've got you covered. With our easy-to-use rating system and detailed expert reviews from professional critics, you'll always know what to expect before making your next game purchase.
          </p>
        </div>
        <div className="flex gap-6">
          <button className="w-32 h-12 rounded-sm font-bold text-[#f1f1f1] bg-[#e30e30] hover:bg-[#f1f1f1] hover:text-[#e30e30]">
            Explore
          </button>
          <button className="w-32 h-12 rounded-sm font-bold border border-[#f1f1f1] hover:bg-[#f1f1f1] hover:text-[#1f1f1f]">
            Join us
          </button>
        </div>
      </section>
    </main>
  );
}
