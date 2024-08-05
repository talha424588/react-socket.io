import logo from './logo.svg';
import './App.css';
import Chat from './Chat';
import Login from './Login';
import Middleware from './Middleware';

function App() {
  return (
    <div className="App">
      <Middleware>
        <Chat />
      </Middleware>
    </div>
  );
}

export default App;
