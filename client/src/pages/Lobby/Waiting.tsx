import { Button } from "@/components";
import { ApiContext } from "@/features/api/GameContext";
import { useYourself } from "@/hooks/useYourself";
import { useContext, useMemo } from "react";

function ReadyIndicator({ ready }: { ready: boolean }) {
  return <div className={`mr-2 h-5 w-5 rounded-full ${ready ? "bg-green-600" : "bg-red-600"}`}></div>;
}

function DisplayPlayers() {
  const { state } = useContext(ApiContext);

  return (
    <ul className="select-none">
      {state.players.map((p, i) => {
        const ready = i % 2 === 0;
        return (
          <li
            key={i}
            className={`my-4 flex items-center text-lg transition-all hover:ml-2 hover:text-xl hover:font-semibold ${!ready ? "text-gray-500" : ""}`}
          >
            <ReadyIndicator ready={ready} />
            {p.name}
          </li>
        );
      })}
    </ul>
  );
}

function Waiting() {
  const player = useYourself();
  const canBeReady = useMemo(() => [player.name, player.seat, player.persona.name].every((v) => v !== null), [player]);

  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <p className="flex-shrink-0 text-base">Be patient {player.name}, the citizens are getting ready...</p>
      <div className="my-2 flex max-h-[calc(100vh-16rem)] flex-col overflow-y-auto rounded-md bg-neutral-100 px-4 shadow-inner">
        <DisplayPlayers />
      </div>
      <div className="group relative mt-4 flex-shrink-0">
        <Button size="button-lg" disabled={!canBeReady} className="w-full">
          Ready
        </Button>
        <span
          className={`transition-opacity duration-300 ${!player.name || player.seat === null ? "visibility-hidden group-hover:visibility-visible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100" : "hidden"}`}
        >
          Please create your character and choose a seat first
        </span>
      </div>
    </div>
  );
}

export default Waiting;
