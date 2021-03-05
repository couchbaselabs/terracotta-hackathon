// import countries from './countries.json';

import BaseData from './basedata';

export default class FhirData extends BaseData {
  constructor(storage) {
    super([]);

    this.storage = storage;
  }

  async fetch() {
    try {
      const data = await this.storage.runQuery(
        `SELECT l.position.latitude AS lat,
                l.position.longitude AS lng,
                25 AS count
         FROM fhirData.data.Location l
         WHERE l.position.latitude IS NOT MISSING
           AND l.position.longitude IS NOT MISSING`
      );

      this._data = data.rows;

      console.log(`Fetched ${this._data.length} records from Fhir database`);

      this._mergedData = this.optimisedMergePoints(this._data, 28000, 100);
    } catch (e) {
      console.log('Failed to fetch fhir data', e);
    }
  }

  get mergedData() {
    return this._mergedData;
  }
}
