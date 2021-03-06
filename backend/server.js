const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const Clarifai = require('clarifai');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'aitest',
      database : 'facecheck'
    }
});

const SERVER_PORT = 3001;
const CLARIFY_API_KEY = '';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome');
});

// Scans image and responds with an array of face detection detection objects, one for each face in the image.
app.post('/scanServer', (req, res) => {
    const clarifaiapp = new Clarifai.App({ apiKey: CLARIFY_API_KEY });
    const { input } = req.body;
    
    clarifaiapp.models.predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(data => { res.json(data.outputs[0].data.regions); })
    .catch(err => { res.status(400).json(err); });
});

// Handle Sign In
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    
    db('logins').where('email', '=', email).select('email', 'hash')
    .then(data => {
        if (data && data.constructor === Array && data.length > 0){
            const loginPassed = bcrypt.compareSync(password, data[0].hash);
            
            if(loginPassed){
                db('users').where('email', '=', data[0].email)
                .then(users => { res.json(users[0]) })
                .catch(err => { res.status(400).json('error_login'); });
            }
            else res.status(400).json('login_failed');
        }
        else res.status(400).json('error_login');
    })
    .catch(err => { res.status(400).json('error_login'); });
});

// Handle user registration
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx('logins').insert({hash: hash, email: email}).returning('email')
        .then(loginEmails => {
            return trx('users').insert({name: name, email: loginEmails[0], entries: 0, created: new Date()}).returning('*')
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
     .then(data => {
        if (data && data.constructor === Array && data.length > 0) res.json(data[0]);
    })
    .catch(err => { console.log(err); res.status(400).json('signup_failed'); });
});

app.put('/entry', (req, res) => {
    const { id } = req.body;
    
    db('users').where('id', '=', id).increment('entries', 1).returning('entries')
    .then(data => {
        if (data && data.constructor === Array && data.length > 0 && typeof +data[0] == 'number'){ return res.json(+data[0]); }
        else { return res.json('update_failed'); }
    })
    .catch(err => { res.status(400).json('update_failed'); });
}); 

// Return a user's profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    db('users').where({ id: id })
    .then(data => {
        if (data && data.constructor === Array && data.length > 0) return res.json(data[0]);
        else res.status(404).json('user_not_found');
    })
    .catch(err => { res.status(400).json('error_getting_user'); });
});


app.listen(SERVER_PORT, (serverPort = SERVER_PORT) => {
    console.log(`App server running on port ${serverPort}.`);
});