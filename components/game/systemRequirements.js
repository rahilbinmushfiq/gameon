export default function SystemRequirements({ systemRequirements: { minimum, recommended } }) {
    return (
        <>
            <h2 className="text-2xl underline">System Requirements Tab</h2>
            <div className="flex gap-16">
                <div>
                    <h3 className="underline">Component</h3>
                    <p>Processor:</p><br />
                    <p>Graphics Card:</p><br />
                    <p>RAM:</p>
                    <p>VRAM:</p>
                    <p>OS:</p>
                    <p>DirectX:</p>
                    <p>HDD Space:</p>
                </div>
                <div>
                    <h3 className="underline">Minimum</h3>
                    <p>{minimum.processors[0]}</p>
                    <p>{minimum.processors[1]}</p>
                    <p>{minimum.graphicsCard[0]}</p>
                    <p>{minimum.graphicsCard[1]}</p>
                    <p>{minimum.ram}</p>
                    <p>{minimum.vram}</p>
                    <p>{minimum.os}</p>
                    <p>{minimum.dx}</p>
                    <p>{minimum.hdd}</p>
                </div>
                <div>
                    <h3 className="underline">Recomended</h3>
                    <p>{recommended.processor[0]}</p>
                    <p>{recommended.processor[1]}</p>
                    <p>{recommended.graphicsCard[0]}</p>
                    <p>{recommended.graphicsCard[1]}</p>
                    <p>{recommended.ram}</p>
                    <p>{recommended.vram}</p>
                    <p>{recommended.os}</p>
                    <p>{recommended.dx}</p>
                    <p>{recommended.hdd}</p>
                </div>
            </div>
        </>
    );
}