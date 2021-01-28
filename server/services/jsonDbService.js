const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const path = require('path');
const config = require('../config.json');

class JsonDbService {
    constructor() {
        const dbPath = path.join(__dirname, '..', ...config.database.path.split('/'));
        const dbConfig = new Config(dbPath, true, true, '/');
        this.db = new JsonDB(dbConfig);
    }
}

class Singleton {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!Singleton.instance) Singleton.instance = new JsonDbService();
        return Singleton.instance;
    }
}

module.exports = Singleton;
