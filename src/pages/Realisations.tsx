// src/pages/Realisations.tsx
import Navigation from "@/components/Navigation";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";

const Realisations = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <br/>
      <br/>
      <main>
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
};

export default Realisations;
