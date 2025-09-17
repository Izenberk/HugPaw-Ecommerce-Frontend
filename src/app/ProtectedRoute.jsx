import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function CatSplash() {
  return (
    <div className="grid min-h-[60vh] place-items-center p-6">
      <div className="relative w-full max-w-3xl h-28 overflow-hidden">
        <div
          style={{
            position: "absolute",
            left: "-20%",
            top: "35%",
            animation: "runAcross 3s linear infinite",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              display: "inline-block",
              animation: "bounce 0.6s ease-in-out infinite",
            }}
          ></span>
        </div>

        <div className="absolute inset-x-0 bottom-2 flex items-center justify-between opacity-40 text-2xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>🐾</span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        HugPaw is checking...
      </p>

      <style>{`
        @keyframes runAcross {
          0%   { transform: translateX(-20%) translateY(0); }
          50%  { transform: translateX(50%) translateY(-6px); }
          100% { transform: translateX(120%) translateY(0); }
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  const [minElapsed, setMinElapsed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (loading || !minElapsed) return <CatSplash />;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
