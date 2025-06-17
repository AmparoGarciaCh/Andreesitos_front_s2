const Hexagon = ({ centerX, centerY, size, stroke = 'gray', fill = 'transparent' }) => {
  const points = [];

  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i;
    const x = centerX + size * Math.cos(angle);
    const y = centerY + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return (
    <polygon
      points={points.join(' ')}
      stroke={stroke}
      strokeWidth="2"
      fill={fill}
    />
  );
};

export default Hexagon;
