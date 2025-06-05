import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./store/profileSlice";
import Home from "./pages/Home";
import "./App.css";
import Layout from "./components/Layout";
import ProfilePage from "./components/ProfilePage";
import Wallet from "./pages/Wallet";
import Auth from "./pages/Auth";

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMe());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
