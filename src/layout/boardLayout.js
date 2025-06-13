// src/layout/boardLayout.js

// Parámetros de tamaño
const HEX_SIZE = 50; // radio del hexágono en píxeles

// Coordenadas axiales de los 19 hexágonos
export const axialCoords = [
    { q: -2, r: -2 }, { q: -4, r: -2 }, { q: 2, r: -2 },
    { q: -1, r: -1 }, { q: 0, r: -1 }, { q: 1, r: -1 }, { q: 2, r: -1 },
    { q: -2, r: 0 }, { q: -1, r: 0 }, { q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 },
    { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 1 }, { q: 2, r: 1 },
    { q: 0, r: 2 }, { q: 1, r: 2 }, { q: 2, r: 2 }
];

// Offsets de vértices desde el centro (hexCornerOffsets en píxeles)
const hexCornerOffsets = Array.from({ length: 6 }, (_, i) => {
    const angleDeg = 60 * i - 30;
    const angleRad = Math.PI / 180 * angleDeg;
    return {
        dx: HEX_SIZE * Math.cos(angleRad),
        dy: HEX_SIZE * Math.sin(angleRad)
    };
});

// Calculamos la posición en píxeles de cada hexágono
export const computeHexCenter = (q, r) => {
    const x = HEX_SIZE * 3/2 * q;
    const y = HEX_SIZE * Math.sqrt(3) * (r + q/2);
    return { x, y };
};

// Construimos lista de vértices del tablero
export const generateVertices = () => {
    const vertexSet = new Map(); // para evitar duplicados
    let vertexId = 0;

    axialCoords.forEach(({ q, r }) => {
        const center = computeHexCenter(q, r);

        hexCornerOffsets.forEach(({ dx, dy }) => {
            const x = Math.round(center.x + dx);
            const y = Math.round(center.y + dy);
            const key = `${x},${y}`;

            if (!vertexSet.has(key)) {
                vertexSet.set(key, {
                    id: vertexId++,
                    x,
                    y
                });
            }
        });
    });

    return Array.from(vertexSet.values());
};

// Construimos las aristas (pares de vértices vecinos)
export const generateEdges = (vertices) => {
    const vertexByKey = {};
    vertices.forEach((v) => {
        vertexByKey[`${v.x},${v.y}`] = v;
    });

    const edgeSet = new Set();
    const edges = [];

    axialCoords.forEach(({ q, r }) => {
        const center = computeHexCenter(q, r);

        // Calcular los vértices del hexágono
        const hexVertices = hexCornerOffsets.map(({ dx, dy }) => {
            const x = Math.round(center.x + dx);
            const y = Math.round(center.y + dy);
            const key = `${x},${y}`;
            return vertexByKey[key];
        });

        // Conectar solo vértices consecutivos (0-1, 1-2, ..., 5-0)
        for (let i = 0; i < 6; i++) {
            const v1 = hexVertices[i];
            const v2 = hexVertices[(i + 1) % 6];
            const keyA = `${Math.min(v1.id, v2.id)}-${Math.max(v1.id, v2.id)}`;

            if (!edgeSet.has(keyA)) {
                edgeSet.add(keyA);
                edges.push({ vStart: v1, vEnd: v2 });
            }
        }
    });

    return edges;
};
