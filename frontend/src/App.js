import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "./features/routing/Routes";
import Notifier from "./features/general/Notifier";

function App() {
  return (
    <Router>
      <div className="App">
        <Notifier />
        <Routing />
      </div>
    </Router>
  );
}

export default App;
