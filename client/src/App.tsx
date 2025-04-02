import { BrowserRouter, Route, Routes } from "react-router";

import { GameScreen, MenuScreen } from "@/pages";
import APIProvider from "./features/api/Provider";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<MenuScreen />} />

        <Route
          path="room/:code"
          element={
            <APIProvider>
              <GameScreen />
            </APIProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
