const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'john',
            email: 'john@abc.com',
            password: 'cookies',
            entries: '0',
            joined: new Date()
        },
        {
            id: '456',
            name: 'bhanu',
            email: 'choti@abc.com',
            password: '123eswar',
            entries: '0',
            joined: new Date()
        },
        {
            id: '789',
            name: 'eswar',
            email: 'eswar@abc.com',
            password: 'eswar123',
            entries: '0',
            joined: new Date()
        }
    ],

    login: [
        {
            id: '987',
            hash: '',
            email: 'john@abc.com'
        }
    ]
}


const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // if(bcrypt.compareSync(req.body.password, "$2b$10$6CuygOD8wkTrFen/1.qKW.l2BHS04JN/s7jj4VM5EEUHIEkoY5BB.")) {
    console.log("jdjfjaj");
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        console.log("login success");
        res.json('success');
    }
    res.status(400).json('error loggig in');
    
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        console.log(hash);
      });
    database.users.push( {
        id: '125',
        name: name,
        email: email,
        entries: '0',
        joined: new Date()
    })

    res.json(database.users[database.users.length - 1]);
})

app.post('/profile/:id', (req, res) => {
    const { id } = req.params;
    database.users.forEach(user => {
        if(user.id === id) {
            res.json(user);
        }
    })
    res.status(404).json('user not found');
})


app.post('/image', (req,res) => {
    const { id } = req.body;
    database.users.forEach(user => {
        if(user.id === id) {
            user.entries++;
            return res.json(user);
        }
    })
    res.status(404).json('user not found');
})

app.listen(3000, () => {
    console.log('app running on port 3000');
})







