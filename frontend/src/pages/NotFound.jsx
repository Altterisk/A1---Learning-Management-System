import { useNavigate } from "react-router-dom";

const NotFound = () => {
  
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button
        onClick={() => navigate('/')}
        className="my-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Return
      </button>
    </div>
  );
};

export default NotFound;