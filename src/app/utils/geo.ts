export interface LatLngPoint {
  lat: number;
  lng: number;
}

/** Kakao LatLng 또는 {lat,lng} 객체를 표준 좌표로 변환 */
export function toLatLngPoint(point: any): LatLngPoint | null {
  if (!point) return null;

  if (typeof point.getLat === 'function' && typeof point.getLng === 'function') {
    return { lat: point.getLat(), lng: point.getLng() };
  }

  const lat = point.lat ?? point.y ?? point.latitude;
  const lng = point.lng ?? point.x ?? point.longitude;

  if (lat == null || lng == null) return null;
  return { lat: Number(lat), lng: Number(lng) };
}

/** 두 좌표 간 거리(km) — Haversine */
export function haversineDistance(a: LatLngPoint, b: LatLngPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** 경로 배열의 누적 이동 거리(km) */
export function calcPathDistance(path: any[]): number {
  const points = path.map(toLatLngPoint).filter((p): p is LatLngPoint => p !== null);
  let total = 0;

  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(points[i - 1], points[i]);
  }

  return total;
}
