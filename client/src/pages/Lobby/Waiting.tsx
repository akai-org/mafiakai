import { Button } from "@/components";

function isReady(ready: boolean) {
  if (ready) {
    return <div className="mr-2 h-5 w-5 rounded-full bg-green-500"></div>;
  } else {
    return <div className="mr-2 h-5 w-5 rounded-full bg-red-500"></div>;
  }
}

function displayPlayers() {
  return (
    <>
      <ul>
        <li className="my-4 flex items-center text-lg">
          {isReady(true)}
          {"player name"}
        </li>
        <li className="my-4 flex items-center text-lg">
          {isReady(false)}
          {"player name"}
        </li>
        <li className="my-4 flex items-center text-lg">
          {isReady(true)}
          {"player name"}
        </li>
        <li className="my-4 flex items-center text-lg">
          {isReady(true)}
          {"player name"}
        </li>
        <li className="my-4 flex items-center text-lg">
          {isReady(false)}
          {"player name"}
        </li>
      </ul>
    </>
  );
}

function Waiting() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <p className="text-justify">Be patient, the citizens are getting ready...</p>
      <div className="flex flex-col gap-y-4">{displayPlayers()}</div>
      <Button disabled>Ready</Button>
    </div>
  );
}

export default Waiting;

