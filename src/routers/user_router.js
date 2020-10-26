const express  = require('express');
const User = require('../models/user_model');
const router = new express.Router();

router.get('/', async(req, res)=>{
    try {
        res.status(200).send("Welcome to lucky strike");
    } catch (err) {
        res.status(400).send(err);
    }
})

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

router.post("/user/logout", async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.token
      );
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  });

  router.post("/user/logoutAll",  async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  });

module.exports = router;