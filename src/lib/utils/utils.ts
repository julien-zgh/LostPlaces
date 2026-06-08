import {
  FaLandmark,
  FaTree,
  FaBuilding,
  FaSkull,
  FaMountain,
  FaWater,
  FaSeedling,
  FaMonument,
  FaArchive,
  FaChurch,
  FaTheaterMasks,
  FaEye,
  FaUmbrellaBeach,
  FaMapMarkerAlt,
  FaIndustry,
  FaArchway,
  FaHistory,
} from "react-icons/fa";
import { IconType } from "react-icons";

export const ICON_MAP: Record<string, IconType> = {
  Castle: FaLandmark,
  Tree: FaTree,
  Building: FaBuilding,
  Skull: FaSkull,
  Mountain: FaMountain,
  Droplet: FaWater,
  Flower: FaSeedling,
  Monument: FaMonument,
  Cave: FaArchway,
  Archive: FaArchive,
  Church: FaChurch,
  Theater: FaTheaterMasks,
  Eye: FaEye,
  Beach: FaUmbrellaBeach,
  MapPin: FaMapMarkerAlt,
  Factory: FaIndustry,
  // Architectural Landmarks also "Building"
  // Archaeological Sites also "Archive"
};
