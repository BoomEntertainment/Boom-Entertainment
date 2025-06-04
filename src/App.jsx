import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/Home";
import "./App.css";
import Layout from "./components/Layout";
import ProfilePage from "./components/ProfilePage";
import Wallet from "./pages/Wallet";
import Auth from "./pages/Auth";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
