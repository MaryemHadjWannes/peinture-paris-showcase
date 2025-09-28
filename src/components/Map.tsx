import React from "react";

interface MapProps {
  address: string;
}

const Map: React.FC<MapProps> = ({ address }) => {
  const encodedAddress = encodeURIComponent(address);
  // Replace YOUR_GOOGLE_MAPS_API_KEY with your actual API key in production
  const mapSrc = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&key=YOUR_GOOGLE_MAPS_API_KEY`;

  return (
    <div className="w-full aspect-[16/9] sm:h-[400px] rounded-2xl overflow-hidden shadow-md">
      <iframe
        title="Localisation de l'adresse"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        aria-label={`Carte Google Maps pour l'adresse ${address}`}
      />
    </div>
  );
};

export default Map;