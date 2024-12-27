import { BrowserRouter, Route, Routes } from "react-router";
import { About, Home, JoinRoom } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="join-room" element={<JoinRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
