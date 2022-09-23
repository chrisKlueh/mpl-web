import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "./features/routing/Routes";

function App() {
  return (
    <Router>
      <div className="App">
        <Routing />
      </div>
    </Router>
  );
}

export default App;
