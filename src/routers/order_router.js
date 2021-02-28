const express = require("express");
const Order = require("../models/order_model");
const Bom = require("../models/bom_model");
const auth = require("../middleware/auth");

// const mappedData = require("../script");
// const bomData = require("../scriptbom");

const router = express.Router();

/**
 *  @METHOD: POST
 *  @Auth: Admin
 *  @description : Create new order by admin
 */

router.post("/order/new", async (req, res) => {
  const order = new Order({
    ...req.body,
  });
  try {
    await order.save();
    res.status(200).send(order);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 *  @METHOD: POST
 *  @Auth: Admin
 *  @description : Read order form XL
//  */

// router.post("/order/readOrders", async (req, res) => {
//   const mapData = mappedData.map(
//     (d) =>
//       new Order({
//         sku: d.SKU,
//         description: d.Description,
//         weeks2: d.Weeks2,
//         weeks4: d.Weeks4,
//         ioQty: d.IOQty,
//         cat: d.Cat,
//         totalNeeded: d.totalNeeded,
//       })
//   );
//   // console.log(mapData);

//   try {
//     mapData.forEach(async (d) => await d.save());
//     res.status(200).send("Hello");
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// /**
//  *  @METHOD: POST
//  *  @Auth: Admin
//  *  @description : Read BOM form XL
//  */

// router.post("/order/readBoms", async (req, res) => {
//   const mapData = bomData.map(
//     (d) =>
//       new Bom({
//         _id: d.sku,
//         sku: d.sku,
//         skuComponent: d.skuComponent,
//         skuComponentQty: d.skuComponentQty,
//         comps: d.comps,
//       })
//   );

//   try {
//     mapData.forEach(async (d) => await d.save());
//     res.status(200).send("Hello");
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

/**
 *  @METHOD: GET
 *  @Auth: general
 *  @description : List of all the orders
 */

router.get("/order/all", async (req, res) => {
  const match = {};
  const sort = {};
  const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const filter = req.query.filter ? req.query.filter : "all";
  const prior = req.query.prior ? req.query.prior : false;
  const priorValue = prior === "true" ? "high" : "low";
  const search = req.query.search ? req.query.search : "";

  console.log(search);

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = part[1] === "desc" ? -1 : 1;
  }
  try {
    if (search != "") {
      const order = await Order.find({ sku: `${search}` })
        .skip((page - 1) * pagination)
        .limit(pagination);
      res.status(200).send(order);
    }
    if (filter == "all") {
      const order = await Order.find({ priority: `${priorValue}` })
        .skip((page - 1) * pagination)
        .limit(pagination);
      res.status(200).send(order);
    } else {
      const order = await Order.find({
        currentDept: `${filter}`,
        priority: `${priorValue}`,
      })
        .skip((page - 1) * pagination)
        .limit(pagination);

      res.status(200).send(order);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 *  @METHOD: GET
 *  @Auth: general
 *  @param: order ID
 *  @description : Get of single order
 */

router.get("/order/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const order = await Order.findById(_id);
    if (!order) {
      return res.status(400);
    }

    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});
/**
 *  @METHOD: POST
 *  @Auth: general
 *  @param: order ID
 *  @description : Get of single order
 */

router.post("/order/priority/:id", async (req, res) => {
  const _id = req.params.id;
  const prior = req.query.prior;
  try {
    const order = await Order.findById(_id);
    if (!order) {
      return res.status(400);
    }
    let priorValue;
    if (prior == "true") {
      priorValue = "high";
    } else {
      priorValue = "low";
    }

    order.priority = priorValue;
    await order.save();
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});
/**
 *  @METHOD: GET
 *  @Auth: general
 *  @param: SKU ID
 *  @description : Get of BOM
 */

router.get("/bom/:sku", async (req, res) => {
  const _id = req.params.sku.toString();
  try {
    const bom = await Bom.findById(_id);
    if (!bom) {
      return res.status(400);
    }
    res.status(200).send(bom);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 *  @METHOD: PATCH
 *  @Auth: general
 *  @param: order ID
 *  @description : Transfer of order form one dept to another dept.
 */

router.patch("/order/transfer/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["currentDept", "transfers"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  const id = req.params.id;
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update operation" });
  }
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send({ error: "Order Not found" });
    }

    updates.forEach((update) => {
      if (update == "transfers") {
        order[update] = order[update].concat(req.body[update]);
      } else {
        order[update] = req.body[update];
      }
    });
    await order.save();
    res.send(order);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 *  @METHOD: PATCH
 *  @Auth: Admin
 *  @param: order ID
 *  @description : admin abitiy to edit the order
 */

router.patch("/order/transfer/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["currentDept", "transfers"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  const id = req.params.id;
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update operation" });
  }
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send({ error: "Order Not found" });
    }

    updates.forEach((update) => {
      order[update] = req.body[update];
    });
    await order.save();
    res.send(order);
  } catch (err) {
    res.status(400).send(err);
  }
});
/**
 *  @METHOD: PATCH
 *  @Auth: Admin
 *  @param: order ID
 *  @description : admin abitiy to edit the order
 */

router.patch("/order/transfer/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["currentDept", "currentDept"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  const id = req.params.id;
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update operation" });
  }
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send({ error: "Order Not found" });
    }

    updates.forEach((update) => {
      order[update] = req.body[update];
    });
    await order.save();
    res.send(order);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
