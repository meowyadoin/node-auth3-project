const bc = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secret = require('../data/secrets.js');

const Users = require('./helpers.js');

//sign up
router.post('/register', (req,res) => {
    let user = req.body;
    const hash = bc.hashSync(req.body.password, 6);
    console.log(user)
    user.password = hash; 

    Users.add(user)
        .then(newUser => {
            console.log(newUser);
            res.status(201).json(newUser);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});
//login
router.post('/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bc.compareSync(password, user.password)){
                const token = generateToken(user);

                req.session.user = user;
                res.status(200).json({ message: `Hello ${user.username}`, token});
            }else{
                res.status(401).json({message: "missing header"})
            }
         })
         .catch(err => {
             console.log(err)
             res.status(500).json(err);
         })
});


//log out
router.get('/auth/logout', (req,res) => {
    console.log(req)
    if(req.session) {
        console.log(req.session)
        req.session.destroy(err => {
            if(err){
                console.log(err)
                res.json({message: "Sorry you're stuck here."})
            }else{
                res.status(200).json({message: "Looks like you made it out this time."})
            }
        })
    }else{
        res.status(500).json({message: 'We ran into an error'})
    }
})


//get list of users
router.get('/', authorized, (req,res) => {
   Users.find()
   .then(users => res.json(users))
   .catch(error => res.json(error))
});


//authorization middleware
function authorized(req,res,next){
    if(req.session && req.session.user){
        console.log(req.session)
        next()
    }else{
        res.status(404).json({message: "You shall not pass!"})
    }
}

//generate tokens 
function generateToken(user){
    const payload = {
        subject: user.id,
        username: user.username
    };
    const options = {
        expiresIn: '3m'
    };
    return jwt.sign(payload, secret.jwtSecret, options);
}

module.exports = router;