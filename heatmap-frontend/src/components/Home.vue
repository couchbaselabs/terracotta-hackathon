<template>
  <div class="map">
    <Maps @ready="setUpMap" />
  </div>
</template>

<script>
import Maps from './google/Maps';
import http from '../utils/http';

export default {
  name: 'Home',
  components: {
    Maps,
  },
  data: () => ({
    points: [],
    locations: ['United Kingdom', 'United States', 'Australia', 'China', 'India', 'Pakistan'],
    circles: [],
  }),
  methods: {
    fetchAndAddPoints(maps, mapObject, url, colour, countMultiplier = 4, fixedSize = false) {
      const _this = this;
      http
        .get(url)
        .then(res => {
          if (res.data.status === 'success') {
            res.data.locations.forEach(point => {
              if (point.count !== 0) {
                if (!this.fixedSize) {
                  _this.circles.push({
                    circle: new maps.Circle({
                      strokeColor: colour,
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: colour,
                      fillOpacity: 0.35,
                      map: mapObject,
                      center: { lat: point.lat, lng: point.lng },
                      radius: (point.count || 1) * countMultiplier,
                    }),
                    radius: (point.count || 1) * countMultiplier,
                    big: false,
                    fixedSize,
                    count: point.count || 1,
                    multiplier: countMultiplier,
                  });
                } else {
                  new maps.Circle({
                    strokeColor: colour,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: colour,
                    fillOpacity: 0.35,
                    map: mapObject,
                    center: { lat: point.lat, lng: point.lng },
                    radius: (point.count || 1) * countMultiplier,
                  });
                }
              }
            });
            // new maps.visualization.HeatmapLayer({
            //   data: res.data.locations.map(it => new maps.LatLng(it.lat, it.lng)),
            //   map: mapObject,
            //   radius: 30,
            // });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setUpMap(googleMaps) {
      const { maps, mapObject } = googleMaps;

      this.fetchAndAddPoints(maps, mapObject, '/mergeddata', '#FF0000');
      this.fetchAndAddPoints(maps, mapObject, '/fhir', '#0000FF', 25, true);

      const _this = this;
      const multiplier = 5;
      let flip = false;
      mapObject.addListener('zoom_changed', () => {
        const zoom = mapObject.getZoom();
        console.log(zoom);
        if ((zoom < 3 && flip) || (zoom >= 3 && !flip)) {
          flip = !flip;
          _this.circles.forEach(data => {
            if (!data.fixedSize) {
              if (zoom < 3 && data.big) {
                data.big = false;
                data.radius /= multiplier;
                data.circle.setRadius(data.radius);
              } else if (zoom >= 3 && !data.big) {
                data.big = true;
                data.radius *= multiplier;
                data.circle.setRadius(Math.min(data.radius, 1000) * data.multiplier * multiplier);
              }
            }
          });
        }
      });

      // DONT USE THIS! ONLY 1 REQUEST ALLOWED PER SECOND
      // this.locations.forEach(location => {
      //   http
      //     .get('/geocode', { params: { address: location } })
      //     .then(res => {
      //       if (res.data.status === 'success' && res.data.results.length) {
      //         console.log(res.data.results[0]);
      //         new maps.Circle({
      //           strokeColor: '#FF0000',
      //           strokeOpacity: 0.8,
      //           strokeWeight: 2,
      //           fillColor: '#FF0000',
      //           fillOpacity: 0.35,
      //           map: mapObject,
      //           center: { lat: res.data.results[0].latitude, lng: res.data.results[0].longitude },
      //           radius: 1000000,
      //         });
      //       }
      //     })
      //     .catch(err => {
      //       console.error(err);
      //     });
      // });

      // this.points.forEach((point, index) => {
      //   new maps.Circle({
      //     strokeColor: '#FF0000',
      //     strokeOpacity: 0.8,
      //     strokeWeight: 2,
      //     fillColor: '#FF0000',
      //     fillOpacity: 0.35,
      //     map: mapObject,
      //     center: point,
      //     radius: 1000,
      //   });
      // });

      // The following code requires billing :(

      // const geocoder = new maps.Geocoder();

      // geocoder.geocode({ address: 'United Kingdom' }, (results, status) => {
      //   console.log(results, status);
      //   if (status === 'OK' && results.length) {
      //     new maps.Circle({
      //       strokeColor: '#FF0000',
      //       strokeOpacity: 0.8,
      //       strokeWeight: 2,
      //       fillColor: '#FF0000',
      //       fillOpacity: 0.35,
      //       map: mapObject,
      //       center: results[0].geometry.location,
      //       radius: 100000,
      //     });
      //   }
      // });
    },
  },
};
</script>

<style scoped></style>
