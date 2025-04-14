import { Button, Input, Modal } from "@/components";
import { ApiContext } from "@/features/api/GameContext";
import { useYourself } from "@/hooks/useYourself";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

export default function ModalPlayerName() {
  const { actions } = useContext(ApiContext);
  const self = useYourself();

  const [playerName, setPlayerName] = useState<string>("");
  const [isModalOpened, setIsModalOpened] = useState(true);
  const playerNameLength = useMemo(() => playerName.trim().length, [playerName]);

  const handleSetPlayerName = (e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value);

  const handleNameConfirmation = useCallback(() => {
    if (playerNameLength <= 1) return;
    actions.setPlayerName(playerName);
    setIsModalOpened(false);
  }, [actions, playerName, playerNameLength]);

  const onEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") handleNameConfirmation();
  };

  useEffect(() => setIsModalOpened(self.name === null), [self.name]);

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
