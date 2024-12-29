function Character() {
  return (
    <form
      className="flex h-full w-full flex-col justify-between p-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex w-full flex-col gap-y-4">
        <p className="text-justify">
          Create your character and choose your preferred role (your choice will
          be considered in the drawing)
        </p>

        {/* Name input */}
        <div className="flex flex-col">
          <label htmlFor="name-input">Name</label>
          <input
            className="rounded-lg border-2 border-neutral-800 p-1 outline-none"
            type="text"
            id="name-input"
            placeholder="np. Jan Kowalski"
          />
        </div>

        {/* Profession input */}
        <div className="flex flex-col">
          <label htmlFor="profession-input">Profession</label>
          <input
            className="rounded-lg border-2 border-neutral-800 p-1 outline-none"
            type="text"
            id="profession-input"
            placeholder="np. Krawiec"
          />
        </div>

        {/* Description input */}
        <div className="flex flex-col">
          <label htmlFor="description-input">Description</label>
          <input
            className="rounded-lg border-2 border-neutral-800 p-1 outline-none"
            type="text"
            id="description-input"
            placeholder="np. Zawsze wiedział, że ktoś go obserwuje."
          />
        </div>

        {/* Role selection */}
        <div className="flex flex-col">
          <label htmlFor="role-selection">Which role do you prefer?</label>
          <select
            className="rounded-lg border-2 border-neutral-800 p-1 outline-none"
            name=""
            id="role-selection"
          >
            <option>Mafiosa</option>
            <option>Citizen</option>
          </select>
        </div>
      </div>

      <button className="select-none rounded-xl bg-neutral-800 p-1 text-white transition-transform active:scale-95">
        Draw my character
      </button>
    </form>
  );
}

export default Character;