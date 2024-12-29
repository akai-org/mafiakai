import { Button, Input } from "@/components";
import { useCallback, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";

function Menu() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCode(e.target.value);

  const handleJoinGame = useCallback(() => {
    navigate(`/game/${code}`);
  }, [code, navigate]);

  return (
    <div className="m-auto mx-4 flex h-screen flex-col items-center justify-center gap-32">
      <div>
        <h1 className="text-center text-6xl font-bold text-gray-900">
          H1 Headline
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Lorem ipsum dolor sit amet.
        </p>
      </div>

      <div className="w-full sm:max-w-96">
        <label className="flex flex-col text-gray-900">
          Enter code
          <Input
            value={code}
            onChange={handleChange}
            maxLength={6}
            type="text"
          />
        </label>
        <Button
          onClick={handleJoinGame}
          disabled={code.length < 6}
          className="mt-4 w-full disabled:opacity-60"
        >
          Join Game
        </Button>
        <div className="my-8 flex items-center justify-center">
          <div className="h-[2px] w-28 bg-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <div className="h-[2px] w-28 bg-gray-300" />
        </div>
        <Button className="w-full">Create Game</Button>
      </div>
    </div>
  );
}

export default Menu;
