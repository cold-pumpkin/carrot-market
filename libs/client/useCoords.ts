import { useEffect, useState } from "react";

interface UseCoordState {
  latitude: number | null;
  longitude: number | null;
}

// 위치정보 관련 custom hook
export default function useCoords() {
  const [coords, setCoords] = useState<UseCoordState>({ latitude: null, longitude: null });

  const onSuccess = ({coords: {latitude, longitude}}: GeolocationPosition) => {
    setCoords({ latitude, longitude });
  };
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  });
  return coords;
}
