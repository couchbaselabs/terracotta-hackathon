<template>
  <div class="map" :style="{ width, height }" />
</template>

<script>
import maps from '../../utils/maps';

export default {
  name: 'Maps',
  props: {
    center: { type: Object, default: () => ({ lat: 40.866667, lng: 34.566667 }) },
    initialZoom: { type: Number, default: () => 1 },
    width: { type: String, default: () => '600px' },
    height: { type: String, default: () => '512px' },
  },
  async mounted() {
    const google = await maps();

    const mapObject = new google.maps.Map(this.$el, {
      zoom: this.initialZoom || 1,
      center: this.center || { lat: 40.866667, lng: 34.566667 },
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          east: 179,
          west: -179,
        },
      },
    });

    this.$emit('ready', { maps: google.maps, mapObject });
  },
};
</script>

<style lang="scss" scoped>
.map {
  min-width: 300px;
  min-height: 256px;
}
</style>
