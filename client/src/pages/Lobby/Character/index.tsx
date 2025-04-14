import { Button, Input } from "@/components";
import { ApiContext } from "@/features/api/GameContext";
import { useYourself } from "@/hooks/useYourself";
import type { Persona } from "@global/Persona";
import { Roles } from "@global/Roles";
import { useContext, useEffect, useMemo, useState } from "react";

function Character() {
  const { actions } = useContext(ApiContext);
  const you = useYourself();

  const [changed, setChanged] = useState(false);
  const [data, setData] = useState<Persona>({
    name: "",
    profession: "",
    description: "",
    preferences: "",
  });

  useEffect(() => {
    if (!changed) setData((p) => ({ ...p, ...you.persona }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [you.persona]);

  const canDraw = useMemo(() => data.name.length > 3 && data.profession.length > 3, [data]);

  const handleInput = (key: keyof Persona) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData((prev) => ({ ...prev, [key]: e.target.value }));
    setChanged(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChanged(false);
    actions.setPersona(data);
  };

  return (
    <form className="flex min-h-full w-full flex-col justify-between gap-y-4 p-4" onSubmit={handleSubmit}>
      <div className="flex h-full w-full flex-col gap-y-4">
        <p className="text-justify">
          Create your character and choose your preferred role (your choice will be considered in the drawing)
        </p>

        {/* Name input */}
        <div className="flex flex-col">
          <label htmlFor="name-input">Name</label>
          <Input
            className="rounded-lg border-2 border-neutral-800 p-1"
            type="text"
            id="name-input"
            placeholder="e.g. John Doe"
            value={data.name}
            onChange={handleInput("name")}
          />
        </div>

        {/* Profession input */}
        <div className="flex flex-col">
          <label htmlFor="profession-input">Profession</label>
          <Input
            className="rounded-lg border-2 border-neutral-800 p-1"
            type="text"
            id="profession-input"
            placeholder="e.g. Teacher, Doctor, etc."
            value={data.profession}
            onChange={handleInput("profession")}
          />
        </div>

        {/* Description input */}
        <div className="flex flex-col">
          <label htmlFor="description-input">Description</label>
          <Input
            type="text"
            id="description-input"
            placeholder="e. g. He always knew someone was watching him."
            value={data.description}
            onChange={handleInput("description")}
          />
        </div>

        {/* Role selection */}
        <div className="flex flex-col">
          <label htmlFor="role-selection">Which role do you prefer?</label>

          <select
            className="rounded-lg border-2 border-neutral-800 p-1 focus:border-4"
            name=""
            id="role-selection"
            value={data.preferences}
            onChange={handleInput("preferences")}
          >
            <option value={""}>None</option>
            <option value={Roles.REGULAR_CITIZEN}>Mafiosa</option>
            <option value={Roles.MAFIOSO}>Citizen</option>
          </select>
        </div>
      </div>

      <Button type="submit" size="button-lg" disabled={!canDraw || !changed}>
        Draw my character
      </Button>
    </form>
  );
}

export default Character;
