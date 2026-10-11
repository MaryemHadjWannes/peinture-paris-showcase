import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SeoHead from "@/components/SeoHead";
import { NOT_FOUND_META } from "@/data/routeMeta";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SeoHead meta={NOT_FOUND_META} />
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-gray-600">Oups ! Cette page est introuvable.</p>
          <a href="/" className="text-blue-500 underline hover:text-blue-700">
            Retour à l’accueil
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
