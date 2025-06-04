import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";
import ProfilePage from "./components/ProfilePage";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<Auth />} />
        </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
