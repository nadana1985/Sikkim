'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Icon, DivIcon, LatLngTuple } from 'leaflet';
import Link from 'next/link';
import { MapPin, ExternalLink, Calendar } from 'lucide-react';
import { Monastery } from '@/types';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

/** Custom orange/amber cluster icon matching the site theme */
export const createClusterIcon = (cluster: { getChildCount: () => number }): DivIcon => {
  const count = cluster.getChildCount();
  let size = 40;
  let fontSize = '14px';
  if (count > 50) {
    size = 56;
    fontSize = '16px';
  } else if (count > 20) {
    size = 48;
    fontSize = '15px';
  }
  return new DivIcon({
    html: `<div style="
      background: linear-gradient(135deg, #f97316, #ea580c);
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: ${fontSize};
      font-family: system-ui, sans-serif;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    ">${count}</div>`,
    className: 'monastery-cluster-icon',
    iconSize: [size, size] as [number, number],
    iconAnchor: [size / 2, size / 2] as [number, number],
  });
};

/** Default marker icon configuration */
const createDefaultIcon = () => {
  try {
    return new Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  } catch (error) {
    console.warn('Failed to create custom icon, using default');
    return undefined;
  }
};

interface MonasteryMapProps {
  monasteries: Monastery[];
  center?: LatLngTuple;
  zoom?: number;
  height?: string;
}

function MonasteryMapComponent({ 
  monasteries, 
  center = [27.3389, 88.6065], // Default to Sikkim center
  zoom = 9,
  height = '500px'
}: MonasteryMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapIcon, setMapIcon] = useState<Icon | undefined>();

  useEffect(() => {
    setIsClient(true);
    setMapIcon(createDefaultIcon());
  }, []);

  if (!isClient) {
    return (
      <div 
        className="bg-gray-200 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={15}
          iconCreateFunction={createClusterIcon}
        >
          {monasteries.map((monastery) => {
            const position: LatLngTuple = [
              monastery.location.latitude,
              monastery.location.longitude
            ];

            return (
              <Marker
                key={monastery.id}
                position={position}
                icon={mapIcon}
              >
                <Popup maxWidth={300} className="monastery-popup">
                  <div className="p-2">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {monastery.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {monastery.description}
                    </p>

                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Founded in {monastery.foundedYear}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">{monastery.location.address}</span>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/monasteries/${monastery.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700 transition-colors"
                      >
                        View Details
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>

                      {monastery.virtualTourId && (
                        <Link
                          href={`/tours/${monastery.virtualTourId}`}
                          className="inline-flex items-center justify-center px-3 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded hover:bg-purple-200 transition-colors"
                        >
                          360° Tour
                        </Link>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

// Dynamic import to avoid SSR issues with Leaflet
const MonasteryMap = dynamic(() => Promise.resolve(MonasteryMapComponent), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-200 rounded-lg flex items-center justify-center h-96">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default MonasteryMap;
