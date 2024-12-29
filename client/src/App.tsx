import { BrowserRouter, Route, Routes } from "react-router";

import ConnectionProvider from "./ConnectionProvider";
import { GameScreen, MenuScreen } from "@/pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<MenuScreen />} />

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
