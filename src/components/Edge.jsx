const Edge = ({ x1, y1, x2, y2 }) => {
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="lightgray"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Edge;
