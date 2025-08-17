import React, { useEffect, useRef } from 'react';
import styles from './GoogleMap.module.css';

const GoogleMap = ({ latitude, longitude, address, className, markerIcon }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const initMap = () => {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API가 로드되지 않았습니다.');
        return;
      }

      const position = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

      // 지도 생성
      const map = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // 마커 생성
      const markerOptions = {
        position: position,
        map: map,
        title: address || '박람회 장소',
      };

      // 커스텀 마커 아이콘이 있으면 적용
      if (markerIcon) {
        const iconConfig = {
          url: markerIcon.url,
        };
        
        // 크기 설정
        if (markerIcon.size) {
          iconConfig.scaledSize = new window.google.maps.Size(markerIcon.size.width, markerIcon.size.height);
        }
        
        // 앵커 설정
        if (markerIcon.anchor) {
          iconConfig.anchor = new window.google.maps.Point(markerIcon.anchor.x, markerIcon.anchor.y);
        }
        
        markerOptions.icon = iconConfig;
      } else {
        // 기본 마커 아이콘
        markerOptions.icon = {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(32, 32),
        };
      }

      new window.google.maps.Marker(markerOptions);

      mapInstanceRef.current = map;
    };

    // Google Maps API가 이미 로드되어 있으면 바로 초기화
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Google Maps API 로드
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API 키가 설정되지 않았습니다.');
        return;
      }

      // 이미 스크립트가 로드 중이거나 로드되었는지 확인
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // 이미 로드 중이면 로드 완료를 기다림
        existingScript.addEventListener('load', initMap);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error('Google Maps API 로드에 실패했습니다.');
      };

      document.head.appendChild(script);
    }

    return () => {
      // cleanup 시 지도 인스턴스 정리
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, address]);

  if (!latitude || !longitude) {
    return (
      <div className={`${styles.mapContainer} ${className || ''}`}>
        <div className={styles.noLocation}>
          위치 정보가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.mapContainer} ${className || ''}`}>
      <div ref={mapRef} className={styles.map}></div>
    </div>
  );
};

export default GoogleMap;