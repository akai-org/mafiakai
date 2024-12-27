import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function JoinRoom() {
  const [room, setRoom] = useState("");
  const [position, setPosition] = useState(0);
  const [messageReceived, setMessageReceived] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("rooms", (newRooms) => {
      setRooms(newRooms);
    });
  });

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("joinRoom", room, position, (message: string) => {
        setMessageReceived(message);
      });
    }
  };

  const createRoom = () => {
    socket.emit("createRoom", (code: string) => {
      setRoom(code);
    });
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
        value={room}
        onChange={(event) => setRoom(event.target.value)}
      />
      <input
        placeholder="Position..."
        onChange={(event) => setPosition(event.target.valueAsNumber)}
      />
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 me-2 mb-2"
        onClick={joinRoom}
      >
        Join Room
      </button>
      <button
        type="button"
        className="text-white bg-red-700 hover:bg-red-800 padding:100 px-5 py-2.5 me-2 mb-2"
        onClick={createRoom}
      >
        Create Room
      </button>
      <br></br>
      {messageReceived}
      <br></br>
      <br></br>
      <p>Available rooms:</p>
      <ul>
        {rooms.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export default JoinRoom;
