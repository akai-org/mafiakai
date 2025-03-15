export class InternalError extends Error {
  constructor(message: (typeof internalErrors)[number]) {
    super(message);
    this.name = "InternalError";
  }
}

const internalErrors = [
  "playerNotFound",
  "playerAlreadyExists",
  "roomNotFound",
  "roomAlreadyExists",
  "cannotExtendTimer",
  "playerHasNoRole",
  "tooFewPlayers",
  "noOneVoted",
] as const;
