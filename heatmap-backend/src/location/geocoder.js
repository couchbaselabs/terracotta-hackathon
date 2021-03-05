import nodeGeocoder from 'node-geocoder';

export default class Geocoder {
  constructor(provider) {
    this.geocoder = nodeGeocoder({ provider });
  }

  geocode(address) {
    return this.geocoder.geocode(address);
  }
}
