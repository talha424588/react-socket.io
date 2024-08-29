import Login from "./Login";

function Middleware({ children }) {
  const token = localStorage.getItem('sanctum-token');

  if (token !== null) {
    return children; 
  } else {
    return <Login />;
  }
}

export default Middleware;