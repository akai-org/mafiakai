interface PlayerSeat {
  id: number;
  name: string;
}

export default function calcSeats(players: string[], yourSeat: number | null): (PlayerSeat | null)[] {
  return new Array(players.length * 2 - (yourSeat !== null ? 2 : 0)).fill(null).map((_v, i) => {
    const isFree = i % 2 === 0;
    const playerId = Math.floor((i + 1) / 2);
    if (yourSeat === null) return isFree ? null : { id: playerId - 1, name: players[playerId - 1] };

    const edge = yourSeat * 2;
    if (i == edge + 0) return { id: playerId, name: players[playerId] };
    if (i == edge + 1) return { id: playerId, name: players[playerId] };

    if (isFree) return null;
    else {
      const edgedId = playerId - 1 + (i >= edge ? 1 : 0);
      return { id: edgedId, name: players[edgedId] };
    }
  });
}
