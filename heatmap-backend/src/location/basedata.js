import { isPointWithinRadius, getCenter } from 'geolib';
import { centroid, points as turfPoints, pointsWithinPolygon } from '@turf/turf';

export default class BaseData {
  constructor(data) {
    this._data = data
      .filter(it => parseFloat(it[6]) && parseFloat(it[7]))
      .map(it => ({ lat: parseFloat(it[6]), lng: parseFloat(it[7]), count: 1 }));
  }

  get data() {
    return this._data;
  }

  optimisedMergePoints(points, sectionSize = 28000, sizeLimit = 2000) {
    const mergedData = [];
    for (let i = 0; i < Math.ceil(points.length / sectionSize); i++) {
      mergedData.push(...this.mergePoints(points.slice(i * sectionSize, (i + 1) * sectionSize), sizeLimit));
    }

    return mergedData.length != points.length
      ? this.optimisedMergePoints(mergedData, sectionSize, sizeLimit)
      : mergedData;
  }

  mergePoints(points, sizeLimit = 2000) {
    const finalResult = points.filter(it => it && it.count >= sizeLimit);
    let result = points.filter(it => it && it.count < sizeLimit);
    console.log('Starting to merge', result.length, 'points. This may take a while.');
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        if (result[i].count >= sizeLimit) {
          break;
        }
        if (
          Math.max(result[i].count, result[j].count) < sizeLimit &&
          isPointWithinRadius(result[j], result[i], 50000)
        ) {
          const center = getCenter([result[i], result[j]]);
          result[i] = { lat: center.latitude, lng: center.longitude, count: result[i].count + result[j].count };
          result[j] = null;
        }
      }
      finalResult.push(...result.filter(it => it && it.count >= sizeLimit));
      result = result.filter(it => it && it.count < sizeLimit);
    }
    finalResult.push(...result);
    console.log('Finished one pass of merging points. Points left:', finalResult.length);
    return finalResult.length != points.length ? this.mergePoints(finalResult, sizeLimit) : finalResult;
  }

  mergePointsToCountries(points, countries) {
    let mappedPoints = points.slice(0, 100000).map(it => [it.lng, it.lat]);
    let mappedTurfPoints = turfPoints(mappedPoints);

    return countries.map((country, index) => {
      const location = centroid(country.geometry);
      console.log('Starting to map', country.name, `(${index}/${countries.length})`);

      const matchingPoints = pointsWithinPolygon(mappedTurfPoints, country.geometry);

      mappedPoints = mappedPoints.filter(
        mappedPoint =>
          !matchingPoints.features.find(
            matchingPoint =>
              matchingPoint.geometry.coordinates[0] === mappedPoint[0] &&
              matchingPoint.geometry.coordinates[1] === mappedPoint[1]
          )
      );
      mappedTurfPoints = turfPoints(mappedPoints);

      return {
        name: country.name,
        lng: location.geometry.coordinates[0],
        lat: location.geometry.coordinates[1],
        count: matchingPoints.features.length,
      };
    });
  }
}
