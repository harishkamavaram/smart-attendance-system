import { useCallback, useEffect, useRef, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useLayoutEffect } from "react";

// Mythri Vihar, Ameerpet, Hyderabad
const DEFAULT_CENTER = [17.4378, 78.4487];
const DEFAULT_ZOOM = 17;
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Debounce hook - returns a debounced version of a callback.
 */
function useDebouncedCallback(callback, delay) {
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);

    // Always call the latest version of the callback
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback(
        (...args) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
        },
        [delay]
    );
}

/**
 * Geocode a free-text address via Nominatim.
 * Returns the top match as { lat, lon, display_name } or null.
 */
async function geocodeAddress(query) {
    const url = `${NOMINATIM_URL}?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(
        query
    )}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding request failed");
    const data = await res.json();
    return data?.[0] ?? null;
}

/**
 * Search Nominatim for a list of address suggestions.
 */
async function searchAddresses(query) {
    const url = `${NOMINATIM_URL}?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
        query
    )}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Search request failed");
    return res.json();
}

/**
 * Silently re-centers/flies the map whenever `target` changes.
 * Kept as a separate child so it can call useMap() inside the MapContainer.
 */
function FlyToTarget({ target }) {
    const map = useMap();

    useEffect(() => {
        if (!target) return;

        map.setView([target.lat, target.lon], map.getZoom(), {
            animate: true,
        });

        setTimeout(() => map.invalidateSize(), 100);
    }, [target, map]);

    return null;
}

/**
 * Listens for clicks on the map and reports the clicked coordinate.
 */
function ClickToPlaceMarker({ onPick }) {
    useMapEvents({
        click(e) {
            onPick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function FixMapSize() {
    const map = useMap();

    useLayoutEffect(() => {
        const resize = () => {
            map.invalidateSize(true);
        };

        requestAnimationFrame(resize);
        setTimeout(resize, 100);
        setTimeout(resize, 300);
        setTimeout(resize, 600);

        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, [map]);

    return null;
}


/**
 * LocationPicker
 * ------------------------------------------------------------------
 * A reusable, Google-Maps-style campus location picker built on top
 * of React Leaflet + OpenStreetMap (Nominatim for search, no API key).
 *
 * Props:
 *  - value: { latitude, longitude, allowedRadius, locationName } (optional initial value)
 *  - onLocationChange: (location) => void, fired whenever the location changes
 *  - addressHint: string - the institute's address; when provided, the map
 *      will auto-search and center on it UNTIL the user manually interacts
 *      with the map (click / drag / search / current-location).
 */
export default function LocationPicker({ value, onLocationChange, addressHint }) {
    const [position, setPosition] = useState([
        Number(value?.latitude) || DEFAULT_CENTER[0],
        Number(value?.longitude) || DEFAULT_CENTER[1],
    ]);
    const [radius, setRadius] = useState(value?.allowedRadius ?? 100);
    const [locationName, setLocationName] = useState(value?.locationName ?? "");

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [flyTarget, setFlyTarget] = useState(null);

    // Tracks whether the user has taken manual control of the map, so we
    // stop auto-following the institute address once they have.
    const userInteractedRef = useRef(false);

    // Keep the latest onLocationChange without re-triggering the effect below.
    const onLocationChangeRef = useRef(onLocationChange);
    useEffect(() => {
        onLocationChangeRef.current = onLocationChange;
    }, [onLocationChange]);

    // Report changes upward whenever the picked location changes.
    useEffect(() => {
        onLocationChangeRef.current?.({
            latitude: position[0],
            longitude: position[1],
            allowedRadius: radius,
            locationName,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position, radius, locationName]);

    // ---- Bonus: auto-search the institute address until user takes over ----
    const debouncedAutoSearch = useDebouncedCallback(async (address) => {
        if (userInteractedRef.current) return;
        if (!address || address.trim().length < 5) return;
        try {
            const match = await geocodeAddress(address);
            if (!match || userInteractedRef.current) return;
            const lat = parseFloat(match.lat);
            const lon = parseFloat(match.lon);
            setPosition([lat, lon]);
            setFlyTarget({ lat, lon });
        } catch {
            // Silently ignore - user can still search manually.
        }
    }, 1200);

    useEffect(() => {
        debouncedAutoSearch(addressHint);
    }, [addressHint, debouncedAutoSearch]);

    // ---- Manual address search box ----
    const debouncedSearch = useDebouncedCallback(async (query) => {
        if (!query || query.trim().length < 3) {
            setSuggestions([]);
            return;
        }
        setIsSearching(true);
        try {
            const results = await searchAddresses(query);
            setSuggestions(results ?? []);
        } catch {
            toast.error("Address search failed. Please try again.");
        } finally {
            setIsSearching(false);
        }
    }, 400);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const handleSelectSuggestion = (result) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        userInteractedRef.current = true;
        setPosition([lat, lon]);
        setFlyTarget({ lat, lon });
        setSearchQuery(result.display_name);
        setSuggestions([]);
    };

    // ---- Marker interactions ----
    const handleMapClick = useCallback((lat, lng) => {
        userInteractedRef.current = true;
        setPosition([lat, lng]);
    }, []);

    const handleMarkerDragEnd = useCallback((e) => {
        userInteractedRef.current = true;
        const { lat, lng } = e.target.getLatLng();
        setPosition([lat, lng]);
    }, []);

    // ---- Current location ----
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by this browser.");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                userInteractedRef.current = true;
                setPosition([latitude, longitude]);
                setFlyTarget({ lat: latitude, lon: longitude });
                setIsLocating(false);
            },
            () => {
                toast.error("Unable to fetch your current location.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };
    // console.log(position);
    // ---- Radius ----
    const handleRadiusChange = (nextValue) => {
        const clamped = Math.min(1000, Math.max(10, Number(nextValue) || 0));
        setRadius(clamped);
    };

    return (
        <div className="space-y-4 rounded-xl border p-5">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Campus Location</h2>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                >
                    {isLocating ? "Locating..." : "📍 Use Current Location"}
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Label htmlFor="mapSearch">Search Address</Label>
                <Input
                    id="mapSearch"
                    placeholder="🔍 Search for an address..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoComplete="off"
                />

                {isSearching && (
                    <p className="mt-1 text-xs text-muted-foreground">Searching...</p>
                )}

                {suggestions.length > 0 && (
                    <ul className="absolute z-[1000] mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
                        {suggestions.map((result) => (
                            <li key={result.place_id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectSuggestion(result)}
                                    className="w-full truncate px-3 py-2 text-left text-sm hover:bg-muted"
                                    title={result.display_name}
                                >
                                    {result.display_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Map */}
            <div className="relative mt-4 h-[320px] w-full overflow-hidden rounded-xl border">
                <MapContainer
                    // key={`${position[0]}-${position[1]}`}
                    center={position}
                    zoom={17}
                    scrollWheelZoom
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FixMapSize />

                    <Marker
                        position={position}
                        draggable
                        eventHandlers={{ dragend: handleMarkerDragEnd }}
                    />

                    <Circle
                        center={position}
                        radius={radius}
                        pathOptions={{
                            color: "hsl(var(--primary))",
                            fillColor: "hsl(var(--primary))",
                            fillOpacity: 0.12,
                            weight: 2,
                        }}
                    />

                    <ClickToPlaceMarker onPick={handleMapClick} />
                    <FlyToTarget target={flyTarget} />
                </MapContainer>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4 text-sm sm:grid-cols-3">
                <div>
                    <p className="text-muted-foreground">Latitude</p>
                    <p className="font-medium text-foreground">{position[0].toFixed(6)}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Longitude</p>
                    <p className="font-medium text-foreground">{position[1].toFixed(6)}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Radius</p>
                    <p className="font-medium text-foreground">{radius} m</p>
                </div>
            </div>

            {/* Radius control */}
            <div>
                <Label htmlFor="radiusRange">
                    Allowed Radius: <span className="font-normal text-muted-foreground">{radius} meters</span>
                </Label>
                <div className="flex items-center gap-3">
                    <input
                        id="radiusRange"
                        type="range"
                        min={10}
                        max={1000}
                        step={10}
                        value={radius}
                        onChange={(e) => handleRadiusChange(e.target.value)}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
                    />
                    <Input
                        type="number"
                        min={10}
                        max={1000}
                        value={radius}
                        onChange={(e) => handleRadiusChange(e.target.value)}
                        className="w-24"
                    />
                </div>
            </div>

            {/* Location Name */}
            <div>
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                    id="locationName"
                    placeholder="Main Campus"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                />
            </div>
        </div>
    );
}
