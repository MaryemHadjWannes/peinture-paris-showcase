import React from "react";

interface MapProps {
  address: string;
}

const Map: React.FC<MapProps> = ({ address }) => {
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&key=YOUR_GOOGLE_MAPS_API_KEY`;

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md">
      <iframe
        title="Google Map"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default Map;
