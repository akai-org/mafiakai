import { Button } from "@/components";

function isReady(ready: boolean) {
  return <div className={`mr-2 h-5 w-5 rounded-full ${ready ? "bg-gradient-to-tr from-green-500 to-green-700" : "bg-gradient-to-tr from-red-500 to-red-700"}`}></div>;
}

function DisplayPlayers(props: { players: string[] }) {
  return (
    <ul>
        {/* Temporary loop from diversity in ready state */}
      {props.players.map((name, i) => {
        const ready = i % 2 === 0;
        return (
          <li className={`flex items-center my-4 text-lg ${ready ? "text-black" : "text-gray-500"}`}>{isReady(ready)}{name}</li>
        );
      })}
    </ul>
  );
}

function Waiting(props: { playername: string[] }) {
    const playername = props.playername[0];
  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <p>Be patient {playername}, the citizens are getting ready...</p>
      <div className="flex flex-col gap-y-4">
        <DisplayPlayers players={["Tomek", "Kasia", "Marek", "Krzysztof", "Ania", "Michał", "Natalia"]}></DisplayPlayers>
      </div>
    <div className="relative group">
        <Button size="button-lg" disabled className="w-full">Ready</Button>
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md py-1 px-2">
            Please create your character and choose a seat first
        </span>
    </div>
    </div>
  );
}

export default Waiting;
