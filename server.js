const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const app = express();

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'planetology',
      database : 'smart-brain'
    }
  });

const saltRounds = 10;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            return db.select('*'). from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        }
        else {
            res.status(400).json('Invalid Credentials')
        }
    })
    .catch(err => res.status(400).json('Invalid Credentials'))    
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    let hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEMail => {
            return trx('users')
            .returning('*')
            .insert ({
                email: loginEMail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
        })
        .catch(err  => {
            res.status(400).json('registration failed');
        })
})

app.post('/profile/:id', (req, res) => {
    const { id } = req.params;
    db('users')
    .where({
        id: id
    })
    .select('*')
    .then(user => {
        if(user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('user not found');
        }
    })
    .catch(err => res.status(404).json('Error finding user'));
})


app.put('/image', (req,res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
       res.json(entries);
    }).catch(err => res.status(400).json('unable to get entries')); 
})

app.listen(3000, () => {
    console.log('app running on port 3000');
})







