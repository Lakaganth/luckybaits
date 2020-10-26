const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    sku:{
        type: String,
        required: true,
    },
    part:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    quantityDone:{
        type: Number,
        // required: true,
    },
    status:{
        type: String,
        enum: ['new', 'partial', 'completed'],
        default: 'new',
        required: true,
    },
    receipt:{
        type: Number,
        required: true,
    },
    pick:{
        type: String,
        required: true,
    },
    currentDept:{
        type: String,
        enum: ['Assembly', 'Painting', 'Home Worker', 'Plating', 'Stamping', 'Nets' , 'Purchasing'],
        default:'Assembly',
        required:true
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
            currentDept:{
                type: String,
                enum: ['Assembly', 'Painting', 'Home Worker', 'Plating', 'Stamping', 'Nets' , 'Purchasing'],
        default:'Assembly',
            },
            time:{
                type: Date,
                default: Date.now,
            },
            availDept:{
                type: String,
                enum: ['Assembly', 'Painting', 'Home Worker', 'Plating', 'Stamping', 'Nets' , 'Purchasing'],
            }
        }
    ]

},
{
    timestamps:true,
});

const Order = mongoose.model("Orders", OrderSchema);

module.exports = Order;
