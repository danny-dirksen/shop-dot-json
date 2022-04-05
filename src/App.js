import './index.css';
import World from './World';

function App() {
  return (
    <div className="app">
      <div className='canvas-holder'>
        <World></World>
      </div>
      <header>shop-dot-json | written by Daniel Dirksen</header>
      <footer>
        <div>Debug:</div>
        <code>{}</code>
      </footer>
      
    </div>
  );
}

export default App;
