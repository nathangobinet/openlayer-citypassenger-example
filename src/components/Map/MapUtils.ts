import { Coordinate } from "ol/coordinate";

class MapUtils {
  static getEnlargedCoord(min: number, max: number): Coordinate {
    const delta = (max - min) / 10;
    return [min - delta, max + delta];
  }

  static enlargeBounds(min: Coordinate, max: Coordinate): Coordinate[] {
    const elargedLat = this.getEnlargedCoord(min[0], max[0]);
    const enlargedLong = this.getEnlargedCoord(min[1], max[1]);
    return [[elargedLat[0], enlargedLong[0]], [elargedLat[1], enlargedLong[1]]];
  }

  static getMinBound(coordinates: Coordinate[]): Coordinate {
    return coordinates.reduce((acc, lonLat) => {
      acc[0] = (lonLat[0] < acc[0]) ? lonLat[0] : acc[0];
      acc[1] = (lonLat[1] < acc[1]) ? lonLat[1] : acc[1];
      return acc;
    }, [Infinity, Infinity]);
  }

  static getMaxBound(coordinates: Coordinate[]): Coordinate {
    return coordinates.reduce((acc, lonLat) => {
      acc[0] = (lonLat[0] > acc[0]) ? lonLat[0] : acc[0];
      acc[1] = (lonLat[1] > acc[1]) ? lonLat[1] : acc[1];
      return acc;
    }, [-Infinity, -Infinity]);
  }
}

export default MapUtils;