export default function Header() {
  return (
    <div className="flex-shrink-0 px-2 py-3 z-50 touch-none">
      {/* Wrap the logo/text in a block div that fits its content */}
      <div className="inline-block">
        <h1
          className="text-4xl tracking-tighter font-light"
          style={{ fontFamily: "Stack Sans Notch, sans-serif" }}
        >
          <span className="font-extrabold">EMT</span> Near Me
        </h1>
        <h2
          className="tracking-widest text-base text-center"
          style={{ fontFamily: "Chulapa, sans-serif" }}
        >
          Madrid bus arrivals
        </h2>
      </div>
    </div>
  );
}
