import React from 'react';
import {
  GoogleMap,
  Marker,
  LoadScript,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

export interface MapPageProps { }
interface Params {
  onRefleshScreen: boolean;
  marker: PropsArray[];
}

interface PropsArray {
  positions: {
    lat: number;
    lng: number;
  }
  name: string;
  peso: string;
}


const Maps: React.FC<Params> = ({ onRefleshScreen, marker }) => {
  const [bibliotecas] = React.useState(['places']);
  const [markers, setMarkers] = React.useState<PropsArray>()
  const [openMarkers, setOpenMarkers] = React.useState(false)
  const [map, setMap] = React.useState<google.maps.Map>();
  const [positionInitial, setPositionInitial] = React.useState({
    lat: -12.9120697,
    lng: -38.4798973
  })


  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBGGpgzowc0djf1JlDzpUYStyExZB6htRE" // ,
  })


  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onMarkerRightClick = (pos: any) => {
    setMarkers(pos)
    setPositionInitial({
      lat: pos.positions.lat,
      lng: pos.positions.lng
    })
    setOpenMarkers(prev => !prev)
  }

  return (
    <div className="border border-gray-200 rounded-lg h-96 p-1 m-2 w-full">
      {/*@ts-ignore */}
      <LoadScript
        googleMapsApiKey='AIzaSyBGGpgzowc0djf1JlDzpUYStyExZB6htRE'>

        {/*@ts-ignore */}
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerStyle={{ width: "100%", height: "100%", borderRadius: 4 }}
          center={positionInitial}
          zoom={5}
        >
          {marker.map((pos, index) => (
            <>
              {/*@ts-ignore */}
              <Marker
                key={index}
                position={pos.positions}
                options={{
                  label: { text: `${index + 1}`, color: "#fff" }
                }}
                onClick={() => onMarkerRightClick(pos)}
              >
                {openMarkers && (
                  <>
                    {/*@ts-ignore */}
                    <InfoWindow
                      position={
                        {
                          lat: markers.positions.lat,
                          lng: markers.positions.lng
                        }
                      }
                      onCloseClick={() => setOpenMarkers(false)}
                    >
                      <div
                        className="map-marker-container">
                        <div
                          className="map-marker">
                          {pos.name.split(" ")[0]}
                        </div>
                        <div
                          className="map-marker">{pos.peso}Kg</div>
                      </div>
                    </InfoWindow>
                  </>
                )}
              </Marker>
            </>
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default Maps;
