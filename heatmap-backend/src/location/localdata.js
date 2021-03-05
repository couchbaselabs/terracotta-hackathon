// import countries from './countries.json';

import BaseData from './basedata';

export default class LocalData extends BaseData {
  constructor(data, mergedData) {
    super(data);

    this._mergedData = mergedData || this.optimisedMergePoints(this._data);

    // this._countryData = countries.features.map(it => ({
    //   name: it.properties.ADMIN,
    //   geometry: feature(it.geometry),
    // }));

    // this._mergedCountryData = this.mergePointsToCountries(this._data, this._countryData);
  }

  get mergedData() {
    return this._mergedData;
  }

  get countryData() {
    return this._countryData;
  }

  get mergedCountryData() {
    return this._mergedCountryData;
  }
}
