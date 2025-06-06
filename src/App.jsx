import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./store/profileSlice";
import { clearToken } from "./store/authSlice";
import Home from "./pages/Home";
import "./App.css";
import Layout from "./components/Layout";
import ProfilePage from "./components/ProfilePage";
import Wallet from "./pages/Wallet";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import UserCommunities from "./pages/Community/UserCommunities";
import CommunityDetail from "./pages/Community/CommunityDetail";

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const AppContent = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      if (token) {
        await dispatch(fetchMe()).unwrap();
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearToken());
      }
      setError(error.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [dispatch, token]);

  if (error) {
    return <ErrorScreen message={error} onRetry={fetchUserData} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          !token ? <Auth /> : user ? <Navigate to="/" replace /> : <Auth />
        }
      />

      <Route
        element={
          <ProtectedLayout>
            <Outlet />
          </ProtectedLayout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/community" element={<UserCommunities />} />
        <Route path="/community/:id" element={<CommunityDetail />} />
      </Route>

      <Route
        path="*"
        element={
          !token ? (
            <Navigate to="/auth" replace />
          ) : user ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
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
