export type GalleryEntry = {
  id: string;
  /** URL path to the saved image (e.g. /generated/focus_123.jpg) */
  imagePath: string;
  /** URL path to the panorama this was captured from */
  panoPath: string | null;
  /** Timestamp of capture */
  capturedAt: number;
  /** Scene parameters used to generate the panorama */
  scene: {
    location?: string;
    timeOfDay?: string;
    era?: string;
    setting?: string;
    weather?: string;
    crowd?: string;
  };
  /** Camera specs active during capture */
  camera: {
    body: string;
    lens: string;
    focalLength: string;
    iso: string;
    sensor: string;
    resolution: string;
  };
};

// In-memory store — persists across client-side navigations within a session,
// clears on page refresh. Avoids localStorage quota issues with large base64 images.
let _entries: GalleryEntry[] = [];

export function getGalleryEntries(): GalleryEntry[] {
  return _entries;
}

export function addGalleryEntry(entry: GalleryEntry): void {
  _entries = [entry, ..._entries];
}

export function removeGalleryEntry(id: string): void {
  _entries = _entries.filter((e) => e.id !== id);
}

export function clearGallery(): void {
  _entries = [];
}
