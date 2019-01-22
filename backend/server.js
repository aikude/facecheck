const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {id: '123', name: 'John Bull', email: 'john@gm.com', password: 'johnpass', entries: 0, joined: new Date()},
        {id: '124', name: 'Sally May', email: 'sally@gm.com', password: 'sallypass', entries: 0, joined: new Date()},
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
});
app.post('/signin', (req, res) => {
    let output = 'fail';
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) output = database.users[0];

    res.json(output);
});
app.post('/register', (req, res) => {
    let passwordhash = '';
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        passwordhash = hash;
    });
    
    database.users.push({id: '125', name: name, email: email, password: passwordhash, entries: 0, joined: new Date()});

    res.json(database.users[database.users.length-1]);
});
app.put('/entry', (req, res) => {
    const { id } = req.body;
    let output = 'not-found';
    
    for (let user of database.users) {
        if (user.id === id){
            user.entries++;
            output = user.entries;
            break;
        }
    };
    return res.json(output);
});
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    database.users.forEach(user => {
        if (user.id === id) return res.json(user);
    })
    return res.status(404).json('not-found');
});


app.listen(3001, () => {
    console.log('App server running on port 3001.');
});