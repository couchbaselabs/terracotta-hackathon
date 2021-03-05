let initialised = !!window.google;

const initCompleted = new Promise(resolve => {
  window.googleMapsCallback = () => resolve(window.google);
});

export default () => {
  if (initialised) {
    return initCompleted;
  }
  initialised = true;

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}&libraries=drawing,visualization&callback=googleMapsCallback`;

  document.head.appendChild(script);

  return initCompleted;
};
