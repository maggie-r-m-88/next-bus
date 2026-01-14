export default function Header() {

  return (
    <div className="flex-shrink-0 bg-white dark:bg-black px-2 md:px-6 py-4 z-50 touch-none">
      <h1
        className="text-4xl text-black dark:text-zinc-50 text-center font-bold flex justify-center"
        style={{ fontFamily: "Chulapa, sans-serif" }}
      >
        <span>N</span><span className="text-3xl">EXT</span><span>B</span><span className="text-3xl">US</span>/<span className="text-2xl">MADRID</span>
      </h1>
    </div>
  );
}
