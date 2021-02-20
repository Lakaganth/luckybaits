const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
    },
    description: {
      type: String,
    },
    weeks2: {
      type: String,
    },
    weeks4: {
      type: String,
    },

    priority: {
      type: String,
      enum: ["high", "low"],
      default: "low",
    },
    ioQty: {
      type: String,
    },
    totalNeeded: {
      type: String,
    },
    cat: {
      type: String,
    },
    currentDept: {
      type: String,
      enum: [
        "Assembly",
        "Painting",
        "Home Worker",
        "Plating",
        "Stamping",
        "Nets",
        "Purchasing",
      ],
      default: "Assembly",
      required: true,
    },
    orderComplete: {
      type: Boolean,
      default: false,
    },
    orderCompleteTime: {
      type: Date,
    },
    transfers: [
      {
        currentDept: {
          type: String,
          enum: [
            "Assembly",
            "Painting",
            "Home Worker",
            "Plating",
            "Stamping",
            "Nets",
            "Purchasing",
          ],
          default: "Assembly",
        },
        time: {
          type: Date,
          default: Date.now,
        },
        availDept: {
          type: String,
          enum: [
            "Assembly",
            "Painting",
            "Home Worker",
            "Plating",
            "Stamping",
            "Nets",
            "Purchasing",
          ],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Orders", OrderSchema);

module.exports = Order;
