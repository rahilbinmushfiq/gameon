import { MdClose } from "react-icons/md";

export default function SystemRequirements({ systemRequirements }) {
  if (!systemRequirements) return (
    <section className="px-6 py-16 bg-[#2a2a2a]">
      <div className="space-y-2">
        <h2 className="font-bold text-lg">Not Available on PC</h2>
        <p>Unfortunately, this game is not available on PC. Check the overview section to get an idea of the platforms this game is available on.</p>
      </div>
    </section>
  );

  const { minimum, recommended } = systemRequirements;

  return (
    <section className="px-6 py-8 bg-[#2a2a2a]">
      <h1 className="heading mb-8">System Requirements</h1>
      <div className="rounded-md bg-[#3a3a3a] overflow-auto">
        <table>
          <tbody className="first-of-type:[&>tr>th]:sticky first-of-type:[&>tr>th]:inset-0 first-of-type:[&>tr>th]:bg-[#3a3a3a]">
            <tr>
              <th>COMPONENT</th>
              <th>MINIMUM</th>
              <th>RECOMMENDED</th>
            </tr>
            <tr>
              <th rowSpan="2">Processor:</th>
              <td>{minimum.processors[0]}</td>
              <td>{recommended.processors[0]}</td>
            </tr>
            <tr>
              <td className="pt-0">{minimum.processors[1]}</td>
              <td className="pt-0">{recommended.processors[1]}</td>
            </tr>
            <tr>
              <th rowSpan="2">Graphics Card:</th>
              <td>{minimum.graphicsCards[0]}</td>
              <td>{recommended.graphicsCards[0]}</td>
            </tr>
            <tr>
              <td className="pt-0">{minimum.graphicsCards[1]}</td>
              <td className="pt-0">{recommended.graphicsCards[1]}</td>
            </tr>
            <tr>
              <th>RAM:</th>
              <td>{minimum.ram}</td>
              <td>{recommended.ram}</td>
            </tr>
            <tr>
              <th>VRAM:</th>
              <td>{!minimum.vram ? <MdClose size={20} color="#a9a9a9" /> : minimum.vram}</td>
              <td>{!recommended.vram ? <MdClose size={20} color="#a9a9a9" /> : recommended.vram}</td>
            </tr>
            <tr>
              <th>OS:</th>
              <td>{minimum.os}</td>
              <td>{recommended.os}</td>
            </tr>
            <tr>
              <th>DirectX:</th>
              <td>{minimum.dx}</td>
              <td>{recommended.dx}</td>
            </tr>
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