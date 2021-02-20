const mongoose = require("mongoose");

const BomSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  skuComponent: {
    type: String,
  },
  skuComponentQty: {
    type: String,
  },
  comps: [
    {
      component: {
        type: String,
      },
      component_description: {
        type: String,
      },
      component_qty: {
        type: Number,
      },
    },
  ],
});

const Bom = mongoose.model("Boms", BomSchema);

module.exports = Bom;
