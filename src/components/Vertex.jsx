const Vertex = ({ x, y, onClick, selected, construccion }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '20px',
        height: '20px',
        backgroundColor: construccion
          ? 'transparent'
          : selected ? 'green' : 'blue',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: 5
      }}
    >
      {construccion === 'facultad' && (
        <img
          src="/src/assets/ficha_facultad.png"
          alt="Facultad"
          style={{
            width: '30px',
            height: '30px',
            position: 'absolute',
            top: '-5px',
            left: '-5px'
          }}
        />
      )}
    </div>
  );
};

export default Vertex;
