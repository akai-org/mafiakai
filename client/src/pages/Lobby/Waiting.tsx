import { Button } from "@/components";

type PlayerInfo = {
  name: string;
  seat: number | null;
  isReady: boolean;
};

type DisplayPlayersProps = {
  players: string[];
};

type WaitingProps = {
  playername: string[];
};

function ReadyIndicator({ ready }: { ready: boolean }) {
  return <div className={`mr-2 h-5 w-5 rounded-full ${ready ? "bg-green-600" : "bg-red-600"}`}></div>;
}

function DisplayPlayers({ players }: DisplayPlayersProps) {
  return (
    <ul>
      {players.map((name, i) => {
        const ready = i % 2 === 0;
        return (
          <li key={i} className={`my-4 flex items-center text-lg ${!ready ? "text-gray-500" : ""}`}>
            <ReadyIndicator ready={ready} />
            {name}
          </li>
        );
      })}
    </ul>
  );
}

function Waiting({ playername }: WaitingProps) {
  const player: PlayerInfo = { name: playername[0], seat: null, isReady: false };
  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <p>Be patient {player.name}, the citizens are getting ready...</p>
      <div className="flex flex-col gap-y-4">
        {/* Example names */}
        <DisplayPlayers
          players={[player.name, "Kasia", "Marek", "Krzysztof", "Ania", "Michał", "Natalia"]}
        ></DisplayPlayers>
      </div>
      <div className="group relative">
        <Button size="button-lg" disabled={!player.name || player.seat === null} className="w-full">
          Ready
        </Button>
        <span
          className={`${!player.name || player.seat === null ? "absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded-md bg-gray-800 px-2 py-1 text-xs text-white group-hover:block" : "hidden"}`}
        >
          Please create your character and choose a seat first
        </span>
      </div>
    </div>
  );
}

export default Waiting;