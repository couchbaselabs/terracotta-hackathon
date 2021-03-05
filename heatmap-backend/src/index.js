import router from './router';
import dotenv from 'dotenv';
import storage from './storage';
import location from './location';

dotenv.config();

const port = process.env.PORT || process.env.APP_PORT || 5000;

const application = {};

storage.setup().then(async finalStorage => {
  application.storage = finalStorage;

  console.log('Starting to load data.');
  const start = new Date();
  application.location = await location.setup(application);
  console.log('Location and Fhir data loaded in', (new Date() - start) / 1000, 'seconds.');

  application.router = router(application);

  application.router.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
});
