# MafiAKAI Documentation

The MafiAKAI project is an implementation of the classic mafia game. Each player has a device through which they interact with the game. They prepare the role they are playing, indicate where they are sitting relative to other players, view information about the roles of other players and vote.

# Contents

1. [Creating the room](#creating-the-room)

2. [Joining the room](#joining-the-game)

3. [Connecting to the room](#connecting-to-the-room)

4. [Player in the room](#player-in-the-room)
   - [Lobby phase](#lobby-phase)

# Creating the room

The player on the main screen clicks the "create room" option. On a separate screen, he selects the settings for this room, e.g. how long the day lasts, and then confirms and is redirected to the newly created room.

# Joining the room

The player can join the game in two ways:

- By entering the code on the main screen of the application in the appropriate field (the application will redirect the player to the **/room/:code** url)
- By clicking on the link to **/room:code**

**Frontend:** These methods are no different

# Connecting to the room

**Frontend:** The player is asked for their real name, then connects to the /socket.io endpoint by providing `name` and `playerId` (if you have already participated in this game)

**Backend:** The player is checked in the `socketAuth` section. The server checks:

- whether a room with a given `code` exists
- whether the player with the given `playerId` is already in the room, if so, whether player is offline
- wheather can a new player join in the current `phase`?

Depending on these conditions, the server returns an `connect_error` or starts communicating with the player using `socketRoutes`

# Player in the room

## Lobby phase

The player in the lobby waits for the game to start, selects his character, a seat, sets his readiness and observes which players are in the room.

**Character panel**
The player chooses his character. He must come up with a name, occupation and a short description. During the game, player must act out this character.

**Seats panel**
The player chooses where they sit in relation to the other players. This helps in playing their characters, because at any moment you can see who someone else is playing

- **Frontend:** The player chooses his place on the dial with the pointer. The arrangement of the dial is based on the players' queue obtained from the server.

  Clicking on an empty spot results in sending the player's position in `playersQueue`: `seatId` to the server. The server then moves all players with position $\gt$ `seatId` forward and gives the player this sent `seatId`.

```typescript
const playersQueue = ["Asia", "Basia", "Celina"];

// the list of players is processed by a specially designed
// function and returns list of seats

type Seat = null | { id: number; name: string };

// null - represents free seat
// {id, name} -represents occupied seat

const seats: Seat[] = [
  null, "Asia", null, "Basia", null "Celina"
];
```

**Players panel**
The player can see which players have joined and whether they are ready and have already taken a seat and express their readiness.

- **Backend:** Once all players are ready, the server starts the countdown which leads to the next `phase`.
