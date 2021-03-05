import couchbase from 'couchbase';

export default {
  async setup() {
    this.cluster = new couchbase.Cluster(process.env.COUCHBASE_ADDRESS, {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    });

    this.bucket = this.cluster.bucket(process.env.COUCHBASE_BUCKET);

    this.collection = this.bucket.defaultCollection();
    this.setupComplete = true;
    return this;
  },
  runQuery(query, options) {
    if (!this.setupComplete) {
      return;
    }

    return this.cluster.query(query, options);
  },
  setupComplete: false,
};
