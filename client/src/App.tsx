import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-y-4">
      <h1 className="text-4xl">Vite + React + TailwindCSS</h1>

      <button
        className="px-4 py-2 border-2 border-blue-600 rounded-3xl transition-transform hover:scale-110 outline-none active:scale-100"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
}
export default App;
