const express = require("express");
const Order = require('../models/order_model');
const auth = require('../middleware/auth');


const router = express.Router();

/**
*  @METHOD: POST
*  @Auth: Admin
*  @description : Create new order by admin 
*/

router.post('/order/new',  async(req,res)=>{
    const order = new Order({
        ...req.body
    });
    try {

        await order.save();
        res.status(200).send(order);
        
    } catch (err) {
        res.status(400).send(err);
    }
})


/**
*  @METHOD: GET
*  @Auth: general
*  @description : List of all the orders
*/

router.get('/order/all',  async(req,res)=>{
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === "true";
      }
      if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = part[1] === "desc" ? -1 : 1;
      }  

      try {
          const order = await Order.find();
          res.status(200).send(order)
      } catch (err) {
        res.status(500).send(err)
      }
})

/**
*  @METHOD: GET
*  @Auth: general
*  @param: order ID   
*  @description : List of single order
*/

router.get('/order/:id', async(req,res)=>{
    const _id = req.params.id;
    try {
        const order = await Order.findById(_id);
        if(!order){
            return res.status(400)
        }
        res.status(200).send(order);
    } catch (err) {
        res.status(500).send(e);
    }
})

/**
*  @METHOD: PATCH
*  @Auth: general
*  @param: order ID   
*  @description : Transfer of order form one dept to another dept.
*/

router.patch('/order/transfer/:id', async (req, res) =>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['currentDept', 'transfers'];
    const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  const id = req.params.id;
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update operation" });
  }
  try {

    const order = await Order.findById(id);

    if(!order){
        return res.status(404).send({error: "Order Not found"})
    }

    updates.forEach(update=> {
        if(update == 'transfers'){
            console.log(req.body[update])
            order[update] = order[update].concat(req.body[update]);
        }else{
            order[update] = req.body[update]
        }
    });
    await order.save();
    res.send(order);
      
  } catch (err) {
    res.status(400).send(err);
  }
})



module.exports = router;