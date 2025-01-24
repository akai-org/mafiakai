import { BrowserRouter, Route, Routes } from "react-router";

import ConnectionProvider from "./ConnectionProvider";
import { GameScreen, MenuScreen } from "@/pages";
import Lobby from "./pages/Lobby";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Lobby />} />

        <Route
          path="room/:code"
          element={
            <ConnectionProvider>
              <GameScreen />
            </ConnectionProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
