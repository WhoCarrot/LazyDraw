const express = require('express');
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');

let wordListCache;
const loadWordList = async () => {
    if (wordListCache) return Promise.resolve(wordListCache);

    return new Promise((resolve, reject) => {
        const parser = parse({ columns: false }, (error, records) => {
            if (error) return reject(error);
            wordListCache = records[0];
            resolve(records[0]);
        });

        const wordListLocation = path.join(__dirname, '..', 'data', 'words.csv');
        fs.createReadStream(wordListLocation).pipe(parser);
    });
};


const routerModule = ({ app, server, io }) => {
    const router = express.Router();

    router.get('/options', async (req, res) => {
        const wordList = await loadWordList();
        const words = [];
        for (let i = 0; i < 3; i++) {
            const r = Math.round(Math.random() * wordList.length);
            words.push(wordList[r]);
        }
        res.send(words);
    });

    router.post('/options/pick/:option', (req, res) => {
        const { option } = req.params;
        console.log(option);
    });

    return router;
};

module.exports = {
    endpoint: '/word',
    router: routerModule
};