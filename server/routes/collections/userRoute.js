const db = require('./../../services/jsonDbService').getInstance().db;
const { v4 } = require('uuid');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    const users = db.getData('/users');
    res.send(users);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const user = db.getData(`/users/${id}`);
    res.send(user);
});

router.post('/', (req, res) => {
    const user = req.body;
    user.id = v4();
    const createResult = db.push(`/users/${user.id}`, user);
    db.save();
    res.send(createResult);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const user = Object.apply(db.getData(`/users/${id}`), req.body);
    const updateResult = db.push(`/users/${id}`, user);
    res.send(updateResult);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const deleteResult = db.delete(`/users/${id}`);
    res.send(deleteResult);
});

module.exports = {
    endpoint: '/users',
    router
};
