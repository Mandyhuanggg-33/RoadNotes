import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Popup, type MapRef } from "react-map-gl/mapbox";
import type { CityEntry } from "../types/city";
import "mapbox-gl/dist/mapbox-gl.css";

type MapViewProps = {
  cities?: CityEntry[];
  focusedCityId?: string | null;
  onMapClick?: (lat: number, lng: number) => void;
  onSelectCity?: (id: string) => void;
};

export default function MapView({
  cities = [],
  focusedCityId = null,
  onMapClick,
  onSelectCity,
}: MapViewProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const selectedCity =
    cities.find((city) => city.id === selectedCityId) || null;

  const focusedCity =
    cities.find((city) => city.id === focusedCityId) || null;

  const initialViewState = useMemo(() => {
    if (cities.length > 0) {
      return {
        longitude: cities[0].lng,
        latitude: cities[0].lat,
        zoom: 4,
      };
    }

    return {
      longitude: -98.5795,
      latitude: 39.8283,
      zoom: 3,
    };
  }, [cities]);

  useEffect(() => {
    if (!focusedCity || !mapRef.current) return;

    mapRef.current.flyTo({
      center: [focusedCity.lng, focusedCity.lat],
      zoom: 8,
      duration: 1500,
    });
  }, [focusedCity]);

  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border bg-red-50 p-6 text-center text-red-600">
        Missing Mapbox token. Check your .env file.
      </div>
    );
  }

  function handleMapClick(event: { lngLat: { lat: number; lng: number } }) {
    const { lat, lng } = event.lngLat;
    onMapClick?.(lat, lng);
  }

  return (
    <div className="h-full overflow-hidden rounded-2xl border shadow-sm">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        onClick={handleMapClick}
      >
        {cities.map((city) => {
          const isFocused = city.id === focusedCityId;

          return (
            <Marker
              key={city.id}
              longitude={city.lng}
              latitude={city.lat}
              anchor="bottom"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCityId(city.id);
                  onSelectCity?.(city.id);
                }}
                className={`rounded-full border-2 border-white shadow transition ${
                  isFocused ? "h-6 w-6 bg-blue-600" : "h-4 w-4 bg-red-500"
                }`}
                aria-label={`View ${city.name}`}
              />
            </Marker>
          );
        })}

        {selectedCity && (
          <Popup
            longitude={selectedCity.lng}
            latitude={selectedCity.lat}
            anchor="top"
            onClose={() => setSelectedCityId(null)}
            closeOnClick={false}
          >
            <div className="text-sm font-medium">{selectedCity.name}</div>
          </Popup>
        )}
      </Map>
    </div>
  );
}