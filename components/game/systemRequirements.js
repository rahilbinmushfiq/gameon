export default function SystemRequirements({ systemRequirements: { minimum, recommended } }) {
  return (
    <section className="px-6 py-8 bg-[#2a2a2a]">
      <h1 className="inline-block mb-8 text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
        System Requirements
      </h1>
      <div className="bg-[#3a3a3a] rounded-md overflow-auto">
        <table>
          <tr>
            <th className="sticky inset-0 bg-[#3a3a3a]">Component</th>
            <th>Minimum</th>
            <th>Recommended</th>
          </tr>
          <tr>
            <th className="sticky inset-0 bg-[#3a3a3a]" rowspan="2">Processor:</th>
            <td>{minimum.processors[0]}</td>
            <td>{recommended.processors[0]}</td>
          </tr>
          <tr>
            <td>{minimum.processors[1]}</td>
            <td>{recommended.processors[1]}</td>
          </tr>
          <tr>
            <th className="sticky inset-0 bg-[#3a3a3a]" rowspan="2">Graphics Card:</th>
            <td>{minimum.graphicsCards[0]}</td>
            <td>{recommended.graphicsCards[0]}</td>
          </tr>
          <tr>
            <td>{minimum.graphicsCards[1]}</td>
            <td>{recommended.graphicsCards[1]}</td>
          </tr>
          <tr>
            <th className="sticky inset-0 bg-[#3a3a3a]">RAM:</th>
            <td>{minimum.ram}</td>
            <td>{recommended.ram}</td>
          </tr>
          <tr>
            <th className="sticky inset-0 bg-[#3a3a3a]">VRAM:</th>
            <td>{minimum.vram}</td>
            <td>{recommended.vram}</td>
          </tr>
          <tr>
            <th className="sticky inset-0 bg-[#3a3a3a]">OS:</th>
            <td>{minimum.os}</td>
            <td>{recommended.os}</td>
          </tr>
          <tr>
            <th className="sticky inset-0 bg-[#3a3a3a]">DirectX:</th>
            <td>{minimum.dx}</td>
            <td>{recommended.dx}</td>
          </tr>
          <tr>
            <th className="sticky inset-0 bg-[#3a3a3a]">HDD Space:</th>
            <td>{minimum.hdd}</td>
            <td>{recommended.hdd}</td>
          </tr>
        </table>
      </div >
    </section>
  );
}