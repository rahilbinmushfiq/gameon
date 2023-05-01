import { MdClose } from "react-icons/md";

/*
 * This component renders the System Requirements section on the Game Details page, which displays the system requirements table containing the minimum and recommended specifications required for the game to run on PC. If system requirements are not available, it displays a message that the game is not available on PC. The component is rendered when users select the `System Requirements` tab on the Game Details page.
 * 
 * @param {Object|null} systemRequirements - The minimum and recommended system requirements to run the game.
 * @param {Object} systemRequirements.minimum - The minimum system requirements to install the game.
 * @param {Array<String>} systemRequirements.minimum.processors - The minimum processor specifications required to run the game.
 * @param {Array<String>} systemRequirements.minimum.graphicsCards - The minimum graphics card specifications required to run the game.
 * @param {string} systemRequirements.minimum.ram - The minimum amount of RAM required to run the game, in GB.
 * @param {string} systemRequirements.minimum.vram - The minimum amount of VRAM required to run the game.
 * @param {string} systemRequirements.minimum.os - The minimum operating system required to run the game.
 * @param {string} systemRequirements.minimum.dx - The minimum version of DirectX required to run the game.
 * @param {string} systemRequirements.minimum.hdd - The minimum amount of hard disk space required to install the game.
 * @param {Object} systemRequirements.recommended - The recommended system requirements to install the game.
 * @param {Array<String>} systemRequirements.recommended.processors - The recommended processor specifications required to run the game.
 * @param {Array<String>} systemRequirements.recommended.graphicsCards - The recommended graphics card specifications required to run the game.
 * @param {string} systemRequirements.recommended.ram - The recommended amount of RAM required to run the game, in GB.
 * @param {string} systemRequirements.recommended.vram - The recommended amount of VRAM required to run the game.
 * @param {string} systemRequirements.recommended.os - The recommended operating system required to run the game.
 * @param {string} systemRequirements.recommended.dx - The recommended version of DirectX required to run the game.
 * @param {string} systemRequirements.recommended.hdd - The recommended amount of hard disk space required to install the game.
 * 
 * @returns {JSX.Element} A React JSX element that displays the System Requirements section of the Game Details page.
 */
export default function SystemRequirements({ systemRequirements }) {
  // If system requirements are not available, display a message that the game is not available on PC
  if (!systemRequirements) return (
    <section className="px-6 pt-8 pb-20 sm:px-10 md:px-14 xl:px-24 2xl:px-32">
      <div className="space-y-2">
        <h2 className="font-bold text-xl">Not Available on PC</h2>
        <p>Unfortunately, this game is not available on PC. Check the overview section to get an idea of the platforms this game is available on.</p>
      </div>
    </section>
  );

  const { minimum, recommended } = systemRequirements;

  return (
    /* --System Requirements Section-- */
    <section className="px-6 pt-8 pb-20 sm:px-10 md:px-14 xl:px-24 2xl:px-32">
      {/* Table container */}
      <div className="rounded-sm overflow-auto bg-[#2f2f2f]">
        {/* Sytem requirements table */}
        <table className="w-full">
          <tbody className="first-of-type:[&>tr>th]:sticky first-of-type:[&>tr>th]:inset-0 first-of-type:[&>tr>th]:bg-[#3a3a3a]">
            {/* Table headers row */}
            <tr>
              <th>COMPONENT</th>
              <th>MINIMUM</th>
              <th>RECOMMENDED</th>
            </tr>
            {/* Processors row */}
            <tr>
              <th rowSpan="2">Processor:</th>
              <td>{minimum.processors[0]}</td>
              <td>{recommended.processors[0]}</td>
            </tr>
            <tr className="[&>td]:pt-0">
              <td>{minimum.processors[1]}</td>
              <td>{recommended.processors[1]}</td>
            </tr>
            {/* Graphics cards row */}
            <tr>
              <th rowSpan="2">Graphics Card:</th>
              <td>{minimum.graphicsCards[0]}</td>
              <td>{recommended.graphicsCards[0]}</td>
            </tr>
            <tr className="[&>td]:pt-0">
              <td>{minimum.graphicsCards[1]}</td>
              <td>{recommended.graphicsCards[1]}</td>
            </tr>
            {/* RAM row */}
            <tr>
              <th>RAM:</th>
              <td>{minimum.ram}</td>
              <td>{recommended.ram}</td>
            </tr>
            {/* VRAM row */}
            <tr>
              <th>VRAM:</th>
              <td>{!minimum.vram ? <MdClose size={20} color="#a9a9a9" /> : minimum.vram}</td>
              <td>{!recommended.vram ? <MdClose size={20} color="#a9a9a9" /> : recommended.vram}</td>
            </tr>
            {/* Operating System row */}
            <tr>
              <th>OS:</th>
              <td>{minimum.os}</td>
              <td>{recommended.os}</td>
            </tr>
            {/* DirectX row */}
            <tr>
              <th>DirectX:</th>
              <td>{minimum.dx}</td>
              <td>{recommended.dx}</td>
            </tr>
            {/* Hard Disk Drive row */}
            <tr>
              <th>HDD Space:</th>
              <td>{minimum.hdd}</td>
              <td>{recommended.hdd}</td>
            </tr>
          </tbody>
        </table>
      </div >
    </section>
  );
}
