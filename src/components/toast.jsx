import './toast.css';
import React, { useEffect } from 'react';

const Toast = ({id, message, type, removeToast}) => {
    useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <div className={`toast ${type}`} onClick={() => removeToast(id)}>
        {message}
    </div>
  );
};

export default Toast;