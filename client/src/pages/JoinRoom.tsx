import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function JoinRoom() {
  const [room, setRoom] = useState("");
  const [position, setPosition] = useState(0);
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("joinRoom", room, position, (message: string)=>{
        setMessageReceived(message);
      });
    }
  };

//   useEffect(() => {
//     socket.on("info", (data: string) => {
//       setMessageReceived(data);
//     });
//   }, []);

  return (
    <div className="App">
        <input
            placeholder="Room Number..."
            onChange={(event) => setRoom(event.target.value)}
        />
        <input
            placeholder="Position..."
            onChange={(event) => setPosition(event.target.valueAsNumber)}
        />
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800" onClick={joinRoom}>Join Room</button>
        <br></br>
        {messageReceived}
    </div>
);
}

export default JoinRoom;
