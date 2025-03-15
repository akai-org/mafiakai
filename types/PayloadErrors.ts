export class PayloadError extends Error {
  constructor(message: (typeof payloadErrors)[number]) {
    super(message);
    this.name = "PayloadError";
  }
}

const payloadErrors = [
  "playerNotFound",
  "targetNotFound",
  "playerAlreadyExists",
  "gameAlreadyStarted",
  "playerIsDead",
  "targetIsDead",
  "youCannotVoteNow",
  "playerIsAlreadyConnected",
] as const;
