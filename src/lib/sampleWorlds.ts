import type { WorldEntry } from "./worldStore";

// Static sample worlds — images live in public/sample-worlds/
// Replace the panoPath filenames with your actual equirectangular JPEGs.
export const SAMPLE_WORLDS: WorldEntry[] = [
  {
    id: "sample_tokyo_night",
    panoPath: "/sample-worlds/tokyo-night.jpg",
    parameters: {
      location: "Tokyo, Japan",
      timeOfDay: "night",
      decade: "Today",
      placeType: "street",
      weather: "clear",
      crowd: "busy",
    },
    prompt: "",
    createdAt: 1,
  },
  {
    id: "sample_paris_golden",
    panoPath: "/sample-worlds/paris-golden-hour.jpg",
    parameters: {
      location: "Paris, France",
      timeOfDay: "golden hour",
      decade: "Today",
      placeType: "street",
      weather: "clear",
      crowd: "moderate",
    },
    prompt: "",
    createdAt: 2,
  },
  {
    id: "sample_havana_1970s",
    panoPath: "/sample-worlds/havana-1970s.jpg",
    parameters: {
      location: "Havana, Cuba",
      timeOfDay: "noon",
      decade: "1970s",
      placeType: "street",
      weather: "clear",
      crowd: "few people",
    },
    prompt: "",
    createdAt: 3,
  },
  {
    id: "sample_marrakech_market",
    panoPath: "/sample-worlds/marrakech-market.jpg",
    parameters: {
      location: "Marrakech, Morocco",
      timeOfDay: "morning",
      decade: "Today",
      placeType: "market",
      weather: "hazy",
      crowd: "busy",
    },
    prompt: "",
    createdAt: 4,
  },
  {
    id: "sample_reykjavik_snow",
    panoPath: "/sample-worlds/reykjavik-snow.jpg",
    parameters: {
      location: "Reykjavik, Iceland",
      timeOfDay: "dawn",
      decade: "Today",
      placeType: "street",
      weather: "snow",
      crowd: "empty",
    },
    prompt: "",
    createdAt: 5,
  },
];
