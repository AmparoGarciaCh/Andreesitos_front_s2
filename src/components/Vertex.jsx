const Vertex = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '8px',
        height: '8px',
        backgroundColor: 'blue',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default Vertex;
