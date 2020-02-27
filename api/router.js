const router = require('express').Router();


const userRoute = require('../users/router.js');


router.use('/users', userRoute);

router.get('/', (req,res) => {
    res.status(200).json({ message: "here you go!"})
});

module.exports = router;