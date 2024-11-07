import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
if (!MAPBOX_TOKEN) {
  throw new Error('Mapbox token is required');
}

mapboxgl.accessToken = MAPBOX_TOKEN;

interface LocationPickerProps {
  value: string;
  onChange: (location: string, coordinates: [number, number]) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [lng, setLng] = useState(-70);
  const [lat, setLat] = useState(40);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geocoder control
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: 'Search for a location'
    });

    map.current.addControl(geocoder);

    // Initialize marker
    marker.current = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Handle marker drag events
    marker.current.on('dragend', () => {
      if (marker.current) {
        const { lng, lat } = marker.current.getLngLat();
        updateLocation(lng, lat);
      }
    });

    // Handle geocoder results
    geocoder.on('result', (e) => {
      const coords = e.result.center;
      if (marker.current && coords) {
        marker.current.setLngLat(coords);
        updateLocation(coords[0], coords[1]);
      }
    });

    // Handle map click events
    map.current.on('click', (e) => {
      if (marker.current) {
        marker.current.setLngLat(e.lngLat);
        updateLocation(e.lngLat.lng, e.lngLat.lat);
      }
    });

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          if (map.current && marker.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 12
            });
            marker.current.setLngLat([longitude, latitude]);
            updateLocation(longitude, latitude);
          }
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const updateLocation = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      const placeName = data.features[0]?.place_name || `${lng.toFixed(6)}, ${lat.toFixed(6)}`;
      onChange(placeName, [lng, lat]);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      onChange(`${lng.toFixed(6)}, ${lat.toFixed(6)}`, [lng, lat]);
    }
  };

  return (
    <div className="space-y-2">
      <div 
        ref={mapContainer} 
        className="h-[400px] w-full rounded-lg shadow-inner border border-gray-300"
      />
      <p className="text-sm text-gray-600">
        Click on the map or search for a location to set the marker
      </p>
    </div>
  );
};