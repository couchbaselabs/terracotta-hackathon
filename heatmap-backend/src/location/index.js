import LocalData from './localdata';
import Geocoder from './geocoder';
import fs from 'fs';
import csv from 'csv';
import FhirData from './fhirdata';

export default {
  async setup(application) {
    // this.geocoder = new Geocoder('openstreetmap');

    this.fhirData = new FhirData(application.storage);
    await this.fhirData.fetch();

    let recreatedData = false;

    this.localData = await new Promise(resolve => {
      const readingData = [];

      if (fs.existsSync('./src/location/mergeddata.json')) {
        fs.readFile('./src/location/mergeddata.json', (err, data) => {
          if (err) {
            console.error('Could not read merged data', err);
          } else {
            resolve(new LocalData([], JSON.parse(data)));
          }
        });
      } else {
        fs.createReadStream('./src/location/coviddata.csv')
          .pipe(csv.parse())
          .on('data', row => {
            readingData.push(row);
          })
          .on('end', () => {
            console.log('Local data loaded.', readingData.length);
            recreatedData = true;
            resolve(new LocalData(readingData));
          });
      }
    });

    if (recreatedData) {
      fs.writeFile('./src/location/mergeddata.json', JSON.stringify(this.localData.mergedData), err => {
        if (err) {
          console.error('Could not save file', err);
        }
      });
    }

    this.setupComplete = true;
    return this;
  },
  setupComplete: false,
};
