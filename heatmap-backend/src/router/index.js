import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

export default application => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.json({ status: 'success', message: 'Hello World' });
  });

  app.get('/geocode', (req, res) => {
    // DONT USE THIS! ONLY 1 REQUEST ALLOWED PER SECOND
    // if (req.query.address) {
    //   application.location.geocoder
    //     .geocode(req.query.address)
    //     .then(results => {
    //       res.json({ status: 'success', results });
    //     })
    //     .catch(error => {
    //       console.log(error);
    //       res.status(500).json({ status: 'failed', message: error });
    //     });
    // } else {
    //   req.status(400).json({ status: 'failed', message: 'Please provide an address as a parameter' });
    // }

    res.status(400).json({ status: 'failed', message: 'Temporarily disabled.' });
  });

  app.get('/test', async (req, res) => {
    try {
      const result = await application.storage.collection.get('playlist::00011b74-12be-4e60-abbf-b1c8b9b40bfe');
      console.log('result', result);
    } catch (e) {
      console.error(e);
    }
    res.json({ status: 'success', message: 'test' });
  });

  app.get('/data', async (req, res) => {
    const data = application.location.localData.data;

    res.json({
      status: 'success',
      locations: data.slice(req.query.start || 0, req.query.end || data.length),
    });
  });

  app.get('/mergeddata', async (req, res) => {
    const data = application.location.localData.mergedData;

    res.json({
      status: 'success',
      locations: data,
    });
  });

  app.get('/fhir', async (req, res) => {
    const data = application.location.fhirData.mergedData;

    res.json({
      status: 'success',
      locations: data,
    });
  });

  app.get('/refreshfhir', async (req, res) => {
    const start = new Date();
    await application.location.fhirData.fetch();

    res.json({
      status: 'success',
      seconds: (new Date() - start) / 1000,
      records: application.location.fhirData.data.length,
    });
  });

  app.get('/countries', async (req, res) => {
    const data = application.location.localData.mergedCountryData;

    res.json({
      status: 'success',
      locations: data,
    });
  });

  return app;
};
