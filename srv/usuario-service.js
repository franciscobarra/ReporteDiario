/*const express = require('express');
const app = express();
const router = express.Router();

const createUser = async (userData) => {
    return await INSERT.into(Usuario).entries(userData);
};
const getUser = async (id) => {
    return await SELECT.from(Usuario).where({ ID: id });
};
const getAllUsers = async () => {
    return await SELECT.from(Usuario);
};
const updateUser = async (id, updatedData) => {
    return await UPDATE(Usuario).set(updatedData).where({ ID: id });
};
const deleteUser = async (id) => {
    return await DELETE.from(Usuario).where({ ID: id });
};

app.post('/Maintainer/Usuario', async (req, res) => {
    const user = await createUser(req.body);
    res.json(user);
});

app.get('/Maintainer/Usuario/:id', async (req, res) => {
    const user = await getUser(req.params.id);
    res.json(user);
});

app.get('/Maintainer/Usuarios', async (req, res) => {
    console.log("SS")
    const users = await getAllUsers();
    res.json(users);
});

app.put('/Maintainer/Usuario/:id', async (req, res) => {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
});

app.delete('/Maintainer/Usuario/:id', async (req, res) => {
    const result = await deleteUser(req.params.id);
    res.json(result);
});

module.exports = router;*/