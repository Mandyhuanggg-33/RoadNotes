import { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Marker,
  Popup,
  Source,
  type MapRef,
} from "react-map-gl/mapbox";
import type { Feature, FeatureCollection, LineString } from "geojson";
import type { CityEntry } from "../types/city";
import "mapbox-gl/dist/mapbox-gl.css";

type MapViewProps = {
  cities?: CityEntry[];
  focusedCityId?: string | null;
  onMapClick?: (lat: number, lng: number) => void;
  onFocusCity?: (id: string) => void;
  onOpenCity?: (id: string) => void;
};

function sortCitiesByCreatedAt(cities: CityEntry[]) {
  return [...cities].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

function buildPartialRouteCoordinates(
  cities: CityEntry[],
  progress: number
): [number, number][] {
  if (cities.length === 0) return [];
  if (cities.length === 1) return [[cities[0].lng, cities[0].lat]];

  const coords = cities.map(
    (city) => [city.lng, city.lat] as [number, number]
  );

  const totalSegments = coords.length - 1;
  const scaledProgress = progress * totalSegments;
  const completedSegments = Math.floor(scaledProgress);
  const segmentProgress = scaledProgress - completedSegments;

  const result: [number, number][] = [coords[0]];

  for (let i = 0; i < completedSegments && i < totalSegments; i++) {
    result.push(coords[i + 1]);
  }

  if (completedSegments < totalSegments) {
    const start = coords[completedSegments];
    const end = coords[completedSegments + 1];

    const partialLng = start[0] + (end[0] - start[0]) * segmentProgress;
    const partialLat = start[1] + (end[1] - start[1]) * segmentProgress;

    if (
      result[result.length - 1][0] !== partialLng ||
      result[result.length - 1][1] !== partialLat
    ) {
      result.push([partialLng, partialLat]);
    }
  }

  return result;
}

export default function MapView({
  cities = [],
  focusedCityId = null,
  onMapClick,
  onFocusCity,
  onOpenCity,
}: MapViewProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [routeProgress, setRouteProgress] = useState(0);

  const sortedCities = useMemo(() => sortCitiesByCreatedAt(cities), [cities]);

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

  useEffect(() => {
    let animationFrameId = 0;
    let startTime: number | null = null;
    const duration = 2200;

    setRouteProgress(0);

    if (sortedCities.length < 2) {
      setRouteProgress(1);
      return;
    }

    function animate(timestamp: number) {
      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const nextProgress = Math.min(elapsed / duration, 1);
      setRouteProgress(nextProgress);

      if (nextProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [sortedCities]);

  const routeCoordinates = useMemo(() => {
    return buildPartialRouteCoordinates(sortedCities, routeProgress);
  }, [sortedCities, routeProgress]);

  const routeGeoJson: FeatureCollection<LineString> = useMemo(() => {
    const features: Feature<LineString>[] =
      routeCoordinates.length >= 2
        ? [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeCoordinates,
              },
              properties: {},
            },
          ]
        : [];

    return {
      type: "FeatureCollection",
      features,
    };
  }, [routeCoordinates]);

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
        {routeGeoJson.features.length > 0 && (
          <Source id="route-source" type="geojson" data={routeGeoJson}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#2563eb",
                "line-width": 4,
                "line-opacity": 0.75,
              }}
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
            />
          </Source>
        )}

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
                  onFocusCity?.(city.id);
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
            <div className="min-w-[140px]">
              <p className="text-sm font-semibold">{selectedCity.name}</p>
              <button
                type="button"
                onClick={() => onOpenCity?.(selectedCity.id)}
                className="mt-2 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
              >
                Open Journal
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}