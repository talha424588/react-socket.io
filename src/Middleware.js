import Login from "./Login";

function Middleware({ children }) {
  const token = localStorage.getItem('sanctum-token');

  if (token !== null) {
    return children; // render the wrapped component (Chat) if token is present
  } else {
    return <Login />; // render the Login component if token is not present
  }
}

export default Middleware;