export class PayloadError extends Error {
  text: (typeof payloadErrors)[number];

  constructor(message: (typeof payloadErrors)[number]) {
    super(message);
    this.name = "PayloadError";
    this.text = message;
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
  "playerCannotBeReady",
  "playerAlreadySeated",
  "playerNotSeated",
  "undefinedCall",
  "seatNotFound",
  "cannotDropYourSeatAlone",
  "cannotDrop",
] as const;
