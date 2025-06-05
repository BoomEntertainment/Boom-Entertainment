import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
      <div className="text-center">
        {user ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">  
              Welcome, {user?.name || "User"}!
            </h1>
            <p className="text-gray-600 mb-8">
              You are logged in successfully.
            </p>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="btn-primary text-lg"
          >
            Login / Register
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
