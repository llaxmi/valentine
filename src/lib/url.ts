export function buildRecipientUrl(letterId: string): string {
  return `${window.location.origin}/v/${letterId}`;
}

export function buildStatusUrl(senderToken: string): string {
  return `${window.location.origin}/check/${senderToken}`;
}
