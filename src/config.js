const backendURL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://andreesitos-back-s2.onrender.com';

export default backendURL;
