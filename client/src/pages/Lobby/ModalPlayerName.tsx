import { Button, Input, Modal } from "@/components";
import { ApiContext } from "@/features/api/GameContext";
import { useContext, useState } from "react";

export default function ModalPlayerName() {
  const { actions } = useContext(ApiContext);

  const [playerName, setPlayerName] = useState<string>("");
  const [isModalOpened, setIsModalOpened] = useState(true);
  const playerNameLength = playerName?.trim().length;

  const handleSetPlayerName = (e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value);

  const handleNameConfirmation = () => {
    if (playerNameLength > 1) {
      actions.setPlayerName(playerName);
      setIsModalOpened(false);
    }
  };

  const onEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleNameConfirmation();
    }
  };

  return (
    <Modal canBeDismissed={false} showCloseIcon={false} isOpened={isModalOpened}>
      <h2 className="mt-3 text-2xl font-bold">Enter your name</h2>
      <p className="text-center">This will help other players bind your name with your character.</p>
      <Input type="text" value={playerName} onChange={handleSetPlayerName} onKeyDown={onEnterDown} className="my-2" />
      <Button disabled={!(playerNameLength > 1)} onClick={handleNameConfirmation}>
        Confirm
      </Button>
    </Modal>
  );
}
