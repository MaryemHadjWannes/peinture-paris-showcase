import React from "react";
import type { City } from "@/data/seo";

interface MapProps {
  city?: City;
}

const Map: React.FC<MapProps> = ({ city }) => {
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1486.2436564842624!2d3.2450302170598593!3d50.16442111714877!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2bdaf20e69c65%3A0x764794606a810f63!2sHN%20R%C3%A9novation!5e0!3m2!1sfr!2sus!4v1759595353754!5m2!1sfr!2sus";

  const title = city ? `Localisation - Intervention ${city.name} (${city.postalCode})` : "Localisation";

  return (
    <div className="w-full aspect-[16/9] sm:h-[400px] rounded-2xl overflow-hidden shadow-md">
      <iframe
        title={title}
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        aria-label={title}
      />
    </div>
  );
};

export default Map;
