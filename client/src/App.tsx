import { BrowserRouter, Route, Routes } from "react-router";

import ConnectionProvider from "./ConnectionProvider";
import Game from "./pages/Game";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        <Route
          path="room/:code"
          element={
            <ConnectionProvider>
              <Game />
            </ConnectionProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
