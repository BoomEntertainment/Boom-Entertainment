import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Sidebar />} />
            <Route path="/auth" element={<Auth />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
