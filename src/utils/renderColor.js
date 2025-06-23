export function renderColorConstruccion(jugadorId, coloresJugadores) {
  if (typeof jugadorId === 'undefined' || !coloresJugadores || typeof coloresJugadores !== 'object') {
    return 'gray';
  }
  return coloresJugadores[jugadorId] || 'gray';
}
