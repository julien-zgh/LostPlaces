import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Map } from "react-map-gl/maplibre";
import type { MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import Supercluster from "supercluster";
import { MapPin, X, Camera, Calendar, Scan, Minus, Plus, Earth } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCategoriesStore } from "@/lib/zustand/CategoriesStore";

// Define Place type since it's not imported
type Place = {
  _id: string;
  sub_id: string;
  title: string;
  description: string;
  location: string;
  country: string;
  coords: [number, number];
  category_id: string;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

type MarkerData = {
  id: string;
  longitude: number;
  latitude: number;
  isCluster: boolean;
  clusterId?: number;
  place?: Place;
  count?: number;
  isSpiderfied?: boolean;
};

type SpiderLine = {
  id: string;
  from: [number, number];
  to: [number, number];
};

export const MapPage = () => {
  const mapRef = useRef<MapRef>(null);
  const superclusterRef = useRef<Supercluster | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [satelliteStyle, setSatelliteStyle] = useState(false);

  const categories = useCategoriesStore((state) => state.categories);

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [spiderLines, setSpiderLines] = useState<SpiderLine[]>([]);
  const [viewState, setViewState] = useState({
    longitude: 35.5,
    latitude: 33.9,
    zoom: 2, // Start with lower zoom to show all markers
  });

  const navigate = useNavigate();

  const spiderfiedClusterIdRef = useRef<number | null>(null);
  const spiderfyRadius = 50;

  const [places, setPlaces] = useState<Place[]>([]);

  const fetchLocations = async () => {
    const res = await fetch("http://localhost:3000/api/fetchMapLocations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      toast.error("Failed to fetch places");
      return;
    }
    const data = await res.json();
    // console.log(data)
    setPlaces(data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Transform places to points for Supercluster
  const points = useMemo(() => {
    const transformedPoints = places
      .filter(
        (place): place is Place & { coords: [number, number] } =>
          Array.isArray(place.coords) &&
          place.coords.length === 2 &&
          !isNaN(place.coords[0]) &&
          !isNaN(place.coords[1])
      )
      .map((place) => ({
        type: "Feature" as const,
        properties: { cluster: false, placeId: place._id, place },
        geometry: {
          type: "Point" as const,
          coordinates: [place.coords[1], place.coords[0]], // lng, lat
        },
      }));

    // console.log("Transformed points:", transformedPoints);
    return transformedPoints;
  }, [places]);

  // Initialize Supercluster
  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 60,
      maxZoom: 17,
      minZoom: 0,
      minPoints: 2,
    });
    cluster.load(points);
    superclusterRef.current = cluster;
    // console.log("Supercluster loaded with points:", points.length);
    return cluster;
  }, [points]);

  const clearSpiderfy = useCallback(() => {
    setMarkers((prev) => prev.filter((marker) => !marker.isSpiderfied));
    setSpiderLines([]);
    spiderfiedClusterIdRef.current = null;
  }, []);

  const renderSpiderfy = useCallback(
    (clusterId: number) => {
      if (!supercluster || !mapRef.current) return;

      try {
        clearSpiderfy();
        const children = supercluster.getLeaves(clusterId, Infinity);
        const clusters = supercluster.getClusters(
          mapRef.current.getBounds().toArray().flat() as [
            number,
            number,
            number,
            number
          ],
          Math.floor(mapRef.current.getZoom())
        );
        const cluster = clusters.find(
          (c) => c.properties?.cluster && c.id === clusterId
        );
        if (!cluster) return;

        const center = cluster.geometry.coordinates as [number, number];
        const centerScreen = mapRef.current.project(center);
        const newSpiderMarkers: MarkerData[] = [];
        const newSpiderLines: SpiderLine[] = [];

        if (children.length > 2) {
          // Full circle arrangement
          const angleStep = (2 * Math.PI) / children.length;
          children.forEach((child, i) => {
            const angle = i * angleStep;
            const x = centerScreen.x + Math.cos(angle) * spiderfyRadius;
            const y = centerScreen.y + Math.sin(angle) * spiderfyRadius;
            const lngLat = mapRef.current!.unproject([x, y + 4]);

            newSpiderLines.push({
              id: `spider-line-${child.properties.place._id}`,
              from: [centerScreen.x, centerScreen.y],
              to: [x, y],
            });

            newSpiderMarkers.push({
              id: `spider-${child.properties.place._id}`,
              longitude: lngLat.lng,
              latitude: lngLat.lat,
              isCluster: false,
              place: child.properties.place,
              isSpiderfied: true,
            });
          });
        } else if (children.length === 2) {
          // Arc arrangement (120 degrees)
          const arcAngle = (Math.PI / 180) * 130;
          const startAngle = Math.PI / 2 - arcAngle / 2;
          const angleStep = arcAngle / (children.length - 1);

          children.forEach((child, i) => {
            const angle = startAngle + i * angleStep;
            const x = centerScreen.x + Math.cos(angle) * spiderfyRadius;
            const y = centerScreen.y + Math.sin(angle) * spiderfyRadius;
            const lngLat = mapRef.current!.unproject([x, y + 4]);

            newSpiderLines.push({
              id: `spider-line-${child.properties.place._id}`,
              from: [centerScreen.x, centerScreen.y],
              to: [x, y],
            });

            newSpiderMarkers.push({
              id: `spider-${child.properties.place._id}`,
              longitude: lngLat.lng,
              latitude: lngLat.lat,
              isCluster: false,
              place: child.properties.place,
              isSpiderfied: true,
            });
          });
        }

        setMarkers((prev) => [
          ...prev.filter((m) => !m.isSpiderfied),
          ...newSpiderMarkers,
        ]);
        setSpiderLines(newSpiderLines);
        spiderfiedClusterIdRef.current = clusterId;
      } catch (error) {
        // console.error("Error in renderSpiderfy:", error);
        spiderfiedClusterIdRef.current = null;
      }
    },
    [supercluster, spiderfyRadius, clearSpiderfy]
  );

  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !supercluster || !mapLoaded) {
      // console.log("Cannot update markers - map not ready", {
      //   mapRef: !!mapRef.current,
      //   supercluster: !!supercluster,
      //   mapLoaded,
      // });
      return;
    }

    try {
      const bounds = mapRef.current.getBounds();
      let west = bounds.getWest();
      let south = bounds.getSouth();
      let east = bounds.getEast();
      let north = bounds.getNorth();

      // Add padding to ensure markers near edges are included
      const lonPadding = (east - west) * 0.2;
      const latPadding = (north - south) * 0.2;
      west -= lonPadding;
      south -= latPadding;
      east += lonPadding;
      north += latPadding;

      const bbox: [number, number, number, number] = [west, south, east, north];
      const zoom = Math.floor(mapRef.current.getZoom());
      const clusters = supercluster.getClusters(bbox, zoom);

      // console.log("Update markers:", {
      //   bbox,
      //   zoom,
      //   clustersFound: clusters.length,
      //   bounds: { west, south, east, north },
      // });

      const newMarkers: MarkerData[] = [];

      clusters.forEach((cluster) => {
        const isCluster = cluster.properties?.cluster === true;
        const clusterId = cluster.id as number | undefined;
        const [lng, lat] = cluster.geometry.coordinates as [number, number];
        const key = isCluster
          ? `cluster-${clusterId}`
          : cluster.properties.placeId;

        newMarkers.push({
          id: key,
          longitude: lng,
          latitude: lat,
          isCluster,
          clusterId,
          place: cluster.properties?.place,
          count: cluster.properties?.point_count,
          isSpiderfied: false,
        });
      });

      // console.log("New markers:", newMarkers);

      setMarkers((prevMarkers) => {
        const spiderfiedMarkers = prevMarkers.filter((m) => m.isSpiderfied);
        return [...newMarkers, ...spiderfiedMarkers];
      });
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  }, [supercluster, mapLoaded]);

  const handleMarkerClick = useCallback(
    (marker: MarkerData) => {
      if (!mapRef.current || !supercluster) return;

      const currentZoom = mapRef.current.getZoom();
      const mapMaxZoom = 17;

      if (marker.isCluster && marker.clusterId !== undefined) {
        if (currentZoom >= mapMaxZoom - 0.05) {
          renderSpiderfy(marker.clusterId);
        } else {
          const expansionZoom = supercluster.getClusterExpansionZoom(
            marker.clusterId
          );
          mapRef.current.easeTo({
            center: [marker.longitude, marker.latitude],
            zoom: expansionZoom,
          });
        }
      } else if (!marker.isCluster && marker.place) {
        navigate(`/place/${marker.place._id}`);
      }
    },
    [supercluster, renderSpiderfy]
  );

  // Handle map load
  const handleMapLoad = useCallback(() => {
    // console.log("Map loaded");
    setMapLoaded(true);
  }, []);

  // Update markers when map loads or view changes
  useEffect(() => {
    if (mapLoaded) {
      // console.log("Map loaded, updating markers");
      updateMarkers();
    }
  }, [mapLoaded, updateMarkers]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const onMove = () => {
      clearSpiderfy();
      updateMarkers();
    };

    const onZoom = () => {
      clearSpiderfy();
      updateMarkers();
    };

    map.on("move", onMove);
    map.on("zoom", onZoom);

    return () => {
      map.off("move", onMove);
      map.off("zoom", onZoom);
    };
  }, [updateMarkers, clearSpiderfy]);

  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  const cartoMapStyle: StyleSpecification = {
    version: 8,
    sources: {
      "carto-light": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxzoom: 18,
      },
    },
    layers: [
      {
        id: "carto-light-layer",
        type: "raster",
        source: "carto-light",
        minzoom: 0,
        maxzoom: 18,
      },
    ],
  };

  const satelliteMapStyle: StyleSpecification = {
    version: 8,
    sources: {
      satellite: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
        maxzoom: 18,
      },
    },
    layers: [
      {
        id: "satellite-layer",
        type: "raster",
        source: "satellite",
        minzoom: 0,
        maxzoom: 18,
      },
    ],
  };

  const renderMarkerContent = (marker: MarkerData) => {
    if (marker.isCluster) {
      const size = marker.isSpiderfied ? 25 : 30;
      const clusterColor =
        (marker.count ?? 0) >= 100
          ? "#B24D3C"
          : (marker.count ?? 0) >= 10
          ? "#E2725B"
          : "#f8bea3ff";

      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: clusterColor,
            opacity: marker.isSpiderfied ? 0.8 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "white",
            fontSize: marker.isSpiderfied ? 14 : 16,
            boxShadow: `0 0 0 4px rgba(226, 114, 91, 0.5)`,
            cursor: "pointer",
          }}
          onClick={() => handleMarkerClick(marker)}
        >
          {marker.count ?? ""}
        </div>
      );
    } else if (marker.place) {
      const size = marker.isSpiderfied ? 80 : 100;
      const categoryColor = categories.find(
        (cat) => cat._id === marker.place.category_id
      )?.color;

      return (
        <div
          style={{
            position: "relative",
            width: size,
            height: size + 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            cursor: "pointer",
            transform: "translateY(-40px)",
          }}
          onClick={() => handleMarkerClick(marker)}
        >
          <div
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 0 15px #00000062)",
            }}
          >
            <div
              style={{
                width: size - 6,
                height: size - 6,
                borderRadius: "50%",
                border: `3px solid ${categoryColor}`,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#eee",
              }}
            >
              <img
                src={
                  import.meta.env.VITE_SUPABASE_STORAGE_URL +
                  marker.place.images?.[0]
                }
                alt={marker.place.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.src = "/Images/logo.png";
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid white",
              marginTop: -1,
              filter: "drop-shadow(0 0 15px #00000062)",
            }}
          />
          <div
            style={{
              width: "100px",
              fontSize: 12,
              color: "#333",
              marginTop: 2,
              textAlign: "center",
              whiteSpace: "nowrap",
              maxWidth: size,
              overflow: "hidden",
              textOverflow: "ellipsis",
              textShadow: ` 
                -1px -1px 0 white,
                 1px -1px 0 white,
                -1px  1px 0 white,
                 1px  1px 0 white
              `,
            }}
          >
            {marker.place.title}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Map Container */}
      <div className="flex-1 relative">
        <Map
          ref={mapRef}
          {...viewState}
          onLoad={handleMapLoad}
          onMove={handleViewStateChange}
          mapStyle={satelliteStyle ? satelliteMapStyle : cartoMapStyle}
          style={{ width: "100%", height: "100%" }}
          maxZoom={17}
        >
          {/* Render spider lines */}
          {spiderLines.map((line) => (
            <div
              key={line.id}
              style={{
                position: "absolute",
                backgroundColor: "#666",
                height: "0.5px",
                zIndex: 0,
                pointerEvents: "none",
                width: `${Math.sqrt(
                  Math.pow(line.to[0] - line.from[0], 2) +
                    Math.pow(line.to[1] - line.from[1], 2)
                )}px`,
                left: `${line.from[0]}px`,
                top: `${line.from[1]}px`,
                transform: `rotate(${
                  Math.atan2(
                    line.to[1] - line.from[1],
                    line.to[0] - line.from[0]
                  ) *
                  (180 / Math.PI)
                }deg)`,
                transformOrigin: "0 50%",
                backgroundImage: "linear-gradient(to right, #999, #555)",
                boxShadow: "0 0 2px #444",
                borderRadius: "1px",
              }}
            />
          ))}

          {/* Render markers */}
          {markers.map((marker) => {
            const isSpiderfiedCluster =
              marker.isCluster &&
              marker.clusterId === spiderfiedClusterIdRef.current;

            return (
              <Marker
                key={marker.id}
                longitude={marker.longitude}
                latitude={marker.latitude}
                anchor="center"
                style={{
                  zIndex: marker.isSpiderfied ? 10 : 5,
                  pointerEvents: "auto",
                  opacity: isSpiderfiedCluster ? 0.4 : 1,
                }}
              >
                {renderMarkerContent(marker)}
              </Marker>
            );
          })}
        </Map>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm"
            onClick={() => mapRef.current?.zoomIn()}
          >
            <Plus />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm"
            onClick={() => mapRef.current?.zoomOut()}
          >
            <Minus />
          </Button>
          <Button
            size="sm"
            variant="outline"
            title="Center"
            className="w-auto h-10 px-2 bg-white/90 backdrop-blur-sm text-xs"
            onClick={() => {
              mapRef.current?.easeTo({
                center: [0, 20],
                zoom: 2,
              });
            }}
          >
            <Scan />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm"
            onClick={() => setSatelliteStyle(!satelliteStyle)}
          >
            <Earth />
          </Button>
        </div>

        {/* Debug Info */}
        {/* <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded text-xs">
          <div>Markers: {markers.length}</div>
          <div>Points: {points.length}</div>
          <div>Zoom: {viewState.zoom.toFixed(1)}</div>
          <div>Map Loaded: {mapLoaded ? "Yes" : "No"}</div>
        </div> */}
      </div>

      {/* Add Place FAB */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-terracotta hover:bg-terracotta/90 shadow-lg z-10"
        onClick={() => navigate("/submit")}
      >
        <Camera className="w-6 h-6" />
      </Button>
    </div>
  );
};
