export function buildWebSocketUrl(agentId) {
  const socketUrl = `wss://ceronica.digiiq.ai/chat/?agent_id=${agentId}`;
  return socketUrl;
}

export function buildSessionUrl(agentId) {
  const sessionUrl = `https://ceronica.digiiq.ai/ceronica/agent-info?agent_id=${agentId}`;
  return sessionUrl;
}
