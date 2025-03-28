import { FaRegClock } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <header className="w-full border-b-2 border-black bg-white py-6 text-black">
        <div className="container mx-auto flex max-w-screen-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FaRegClock />
            <span className="text-md font-bold">00:00</span>
          </div>

          <h1 className="text-xl font-semibold">Day 0</h1>

          <button className="aspect-square w-6 cursor-pointer transition hover:text-gray-400">
            <IoMdSettings className="h-full w-full" />
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

export default Layout;
