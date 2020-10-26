const express  = require('express');
const User = require('../models/user_model');
const router = new express.Router();

router.post("/user/login", async(req,res) =>{
    try {
        const user = await User.findByCredentials(
            req.body.name,
            req.body.password
        );
        console.log(req.body.name);
        const token = await user.generateAuthToken()
        res.send({user: user, token});
    } catch (err) {;
        console.log(err);
        res.status(400).send(err);
    }
});

router.post("/user/register", async(req, res)=>{
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

module.exports = router;