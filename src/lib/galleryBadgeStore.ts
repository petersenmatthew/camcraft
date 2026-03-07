let _unseen = 0;

export function getUnseenCount(): number {
  return _unseen;
}

export function incrementUnseen(): void {
  _unseen += 1;
}

export function resetUnseen(): void {
  _unseen = 0;
}
