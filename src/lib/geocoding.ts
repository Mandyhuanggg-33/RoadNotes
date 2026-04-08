export async function geocodeCity(name: string) {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
    if (!token) {
      throw new Error("Missing Mapbox access token.");
    }
  
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
      name
    )}&types=place&limit=1&access_token=${token}`;
  
    const res = await fetch(url);
  
    if (!res.ok) {
      throw new Error("Failed to fetch city coordinates.");
    }
  
    const data = await res.json();
  
    const feature = data.features?.[0];
    if (!feature) {
      throw new Error("City not found.");
    }
  
    const coords = feature.geometry?.coordinates;
    if (!coords || coords.length < 2) {
      throw new Error("Invalid coordinates returned.");
    }
  
    return {
      name: feature.properties?.name || name,
      fullName: feature.properties?.full_address || feature.properties?.name || name,
      lng: coords[0],
      lat: coords[1],
    };
  }