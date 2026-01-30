import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Fatwa: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Automatically redirect to Circle of Knowledge
    navigate(`/circle${location.search || ''}`);
  }, [navigate, location.search]);

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-gradient-to-br from-islamic-cream/30 via-white to-islamic-gold/10">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block w-8 h-8 border-4 border-islamic-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-islamic-dark/70">Redirecting to Circle of Knowledge...</p>
      </div>
    </div>
  );
};

export default Fatwa;
