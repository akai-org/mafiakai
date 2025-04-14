import { Button } from "@/components";
import { ApiContext } from "@/features/api/GameContext";
import { useYourself } from "@/hooks/useYourself";
import { useContext, useMemo } from "react";

function ReadyIndicator({ ready }: { ready: boolean }) {
  return <div className={`mr-2 h-5 w-5 rounded-full ${ready ? "bg-green-600" : "bg-red-600"}`}></div>;
}

function DisplayPlayers() {
  const { state } = useContext(ApiContext);
  const self = useYourself();

  return (
    <ul className="select-none">
      {state.players.map((p, i) => {
        return (
          <li
            key={i}
            className={`flex items-center gap-x-2 px-4 py-2 text-lg transition-all hover:ml-2 hover:text-xl hover:font-semibold ${!p.isReady ? "text-gray-500" : ""}`}
          >
            <ReadyIndicator ready={p.isReady} />
            {p.name ?? "Unknown"}
            {p.id === self.id && <span className="text-gray-300">You</span>}
          </li>
        );
      })}
    </ul>
  );
}

function Waiting() {
  const { actions } = useContext(ApiContext);
  const self = useYourself();
  const canBeReady = useMemo(() => self.name !== null && self.seat !== null && self.persona.name.length > 1, [self]);

  const handleReady = () => actions.setReady(true);
  const handleUnready = () => actions.setReady(false);

  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <p className="flex-shrink-0 text-base">Be patient {self.name ?? "Unknown"}, the citizens are getting ready...</p>
      <div className="flex max-h-[calc(100vh-16rem)] flex-col overflow-y-auto rounded-md bg-neutral-100 py-2 shadow-inner">
        <DisplayPlayers />
      </div>
      <div className="group relative mt-4 flex-shrink-0">
        <Button
          size="button-lg"
          disabled={!canBeReady}
          className="w-full"
          onClick={self.isReady ? handleUnready : handleReady}
        >
          {self.isReady ? "Unready" : "Ready"}
        </Button>
        <span
          className={`transition-opacity duration-300 ${!canBeReady ? "visibility-hidden group-hover:visibility-visible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100" : "hidden"}`}
        >
          Please create your character and choose a seat first
        </span>
      </div>
    </div>
  );
}

export default Waiting;
