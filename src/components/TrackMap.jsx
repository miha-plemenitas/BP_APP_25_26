import maplibregl from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";
import { racelandKrsko } from "../data/tracks.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card.jsx";

function normalizePoints(points) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  return points.map(([x, y]) => [
    racelandKrsko.center[0] + (((x - minX) / width) - 0.5) * 0.0023,
    racelandKrsko.center[1] - (((y - minY) / height) - 0.5) * 0.0017
  ]);
}

function getTrackPose(points, progress) {
  const closed = [...points, points[0]];
  const scaled = progress * points.length;
  const index = Math.floor(scaled) % points.length;
  const local = scaled - Math.floor(scaled);
  const [lon1, lat1] = closed[index];
  const [lon2, lat2] = closed[index + 1];

  return {
    coordinates: [lon1 + (lon2 - lon1) * local, lat1 + (lat2 - lat1) * local],
    bearing: Math.atan2(lon2 - lon1, lat2 - lat1) * (180 / Math.PI),
  };
}

export default function TrackMap({ sample }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const carElementRef = useRef(null);
  const geoPoints = useMemo(() => normalizePoints(racelandKrsko.outline), []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: racelandKrsko.center,
      zoom: 16.75,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      const trackSource = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [...geoPoints, geoPoints[0]],
        },
        properties: {},
      };

      map.addSource("raceland-track", {
        type: "geojson",
        data: trackSource,
      });

      map.addLayer({
        id: "raceland-track",
        type: "line",
        source: "raceland-track",
        paint: {
          "line-color": "#111111",
          "line-width": 3,
          "line-opacity": 1,
        },
      });
    });

    const carElement = document.createElement("div");
    carElement.className = "map-car-marker";
    carElement.innerHTML = "<span></span>";
    carElementRef.current = carElement;

    const pose = getTrackPose(geoPoints, sample.progress);
    markerRef.current = new maplibregl.Marker({
      element: carElement,
      rotationAlignment: "map",
    })
      .setLngLat(pose.coordinates)
      .addTo(map);

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [geoPoints]);

  useEffect(() => {
    if (!markerRef.current || !carElementRef.current) {
      return;
    }

    const pose = getTrackPose(geoPoints, sample.progress);
    markerRef.current.setLngLat(pose.coordinates);
    carElementRef.current.style.setProperty("--car-bearing", `${pose.bearing}deg`);
  }, [geoPoints, sample.progress]);

  return (
    <Card className="track-panel">
      <CardHeader>
        <div>
          <p className="eyebrow">Track</p>
          <CardTitle>{racelandKrsko.name}</CardTitle>
        </div>
        <span>{Math.round(sample.progress * 100)}%</span>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="track-map"
          role="img"
          aria-label="MapLibre map of Raceland Krsko with moving car marker"
        />
        <div className="track-meta">
          <span>{racelandKrsko.lengthKm.toFixed(3)} km</span>
          <span>{racelandKrsko.turns} turns</span>
          <span>{racelandKrsko.location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
