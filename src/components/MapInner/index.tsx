"use client";

import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Map } from "react-map-gl/maplibre";
import type { MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";

import useDetectScreen from "@/lib/hooks/useDetectScreen";

import MaplibreMarkerClusterGroup from "./MarkerClusterGroup";
import useMarkerData from "@/lib/hooks/Maplibre/useMarkerData";
import { logDevOnly } from "@/lib/hooks/useDev";
import { useCategories } from "@/lib/hooks/Supabase/useCategories";
import { TypeSearchLocation } from "@/lib/data/Places";
import { useSuperParamsStore } from "@/lib/zustand/SuperParamsStore";
import useMapStore from "@/lib/zustand/useMapStore";
import type { StyleSpecification } from "maplibre-gl";
import useMaplibreStore from "@/lib/zustand/Maplibre/useMapStore";
import useMapContext from "@/lib/hooks/Maplibre/useMapContext";

const CenterToMarkerButton = dynamic(
  async () =>
    (await import("../../../ui/MapLibre/buttons/CenterButton")).CenterButton,
  { ssr: false },
);
const LocateButton = dynamic(
  async () =>
    (await import("../../../ui/MapLibre/buttons/LocateButton")).LocateButton,
  { ssr: false },
);

const MaplibreMapInner = () => {
  const { viewportRef, viewportWidth, viewportHeight } = useDetectScreen();

  const mapRef = useRef<MapRef>(null);
  const setMapRef = useMaplibreStore((state) => state.setMapRef);
  const { setMap } = useMapContext();
  const setIsMapGlLoaded = useMaplibreStore((state) => state.setIsMapGlLoaded);
  const isMapGlLoaded = useMaplibreStore((state) => state.isMapGlLoaded);
  useEffect(() => {
    if (mapRef) {
      setMapRef(mapRef);
    }
  }, [mapRef, setMapRef]);

  const filteredPlaces = useMapStore((s) => s.filteredPlaces);
  const selectedCategoryID = useSuperParamsStore((s) => s.params.category);

  const { allMarkersBoundCenter, setActiveMarker } = useMarkerData({
    locations: filteredPlaces ?? [],
    // mapRef,
    viewportWidth,
    viewportHeight,
  });

  const { categories, getCategoryById } = useCategories();

  const defaultViewState = {
    longitude: 35.6534,
    latitude: 34.1235,
    zoom: 13,
  };
  const [viewState, setViewState] = useState(defaultViewState);

  const allCategory = categories?.find((cat) => cat.id === "ALL");
  const clusterColors = useMemo(() => {
    const categoryID =
      selectedCategoryID === "events" ? "special_events" : selectedCategoryID;

    const catColor =
      categoryID &&
      categoryID.toUpperCase() !== allCategory?.id &&
      getCategoryById(categoryID.toUpperCase())?.color;

    if (catColor) return { small: catColor, medium: catColor, large: catColor };

    return {
      small: "#00c6d9",
      medium: "#0891b2",
      large: "#006A94",
    };
  }, [selectedCategoryID, getCategoryById, allCategory]);

  useEffect(() => {
    if (!allMarkersBoundCenter || !mapRef.current) return;

    mapRef.current.flyTo({
      center: allMarkersBoundCenter.centerPos as [number, number],
      zoom: allMarkersBoundCenter.minZoom,
      animate: false,
    });

    setViewState({
      longitude: allMarkersBoundCenter.centerPos[0],
      latitude: allMarkersBoundCenter.centerPos[1],
      zoom: allMarkersBoundCenter.minZoom,
    });
  }, [allMarkersBoundCenter]);

  const handleMapClick = useCallback(
    (event: any) => {
      logDevOnly("Clicked Coords", `${event.lngLat.lng}, ${event.lngLat.lat}`);
      setActiveMarker(undefined);
    },
    [setActiveMarker],
  );

  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  const handleMarkerClick = useCallback(
    (place: TypeSearchLocation) => {
      setActiveMarker(place);
    },
    [setActiveMarker],
  );

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

  const onLoad = useCallback(() => {
    // console.log(
    //   "Map loaded, setting center and zoom allMarkersBoundCenter",
    //   allMarkersBoundCenter,
    //   "isMapGlLoaded",
    //   isMapGlLoaded,
    // );
    if (!allMarkersBoundCenter || isMapGlLoaded) return;
    console.log("Map loaded, setting center and zoom");
    setIsMapGlLoaded(true);
  }, [allMarkersBoundCenter, isMapGlLoaded, setIsMapGlLoaded]);

  return (
    <div className="relative h-full w-full overflow-hidden" ref={viewportRef}>
      {allMarkersBoundCenter && (
        <div className="absolute top-0 left-0 bottom-[-30px] w-full">
          <Map
            ref={(instance) => {
              if (instance) {
                mapRef.current = instance;
                setMapRef(mapRef);
                setMap?.(instance);
                setIsMapGlLoaded(true);
              }
            }}
            {...viewState}
            onMove={handleViewStateChange}
            onClick={handleMapClick}
            onLoad={onLoad}
            mapStyle={cartoMapStyle}
            style={{ width: "100%", height: "100%" }}
            maxZoom={17.5}
          >
            {allMarkersBoundCenter && (
              <>
                <CenterToMarkerButton
                  center={[
                    allMarkersBoundCenter.centerPos[1],
                    allMarkersBoundCenter.centerPos[0],
                  ]}
                  zoom={allMarkersBoundCenter.minZoom}
                />
                <LocateButton onClick={() => setActiveMarker(undefined)} />
                <MaplibreMarkerClusterGroup
                  onClick={handleMarkerClick}
                  clusterColors={clusterColors}
                />
              </>
            )}
          </Map>
        </div>
      )}

      {!isMapGlLoaded && (
        <div className="absolute inset-0 z-50 bg-mapBg flex justify-center items-center">
          Loading Map...
        </div>
      )}
    </div>
  );
};

export default memo(MaplibreMapInner);
