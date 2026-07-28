const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true,
        enum:[
            "Battery",
            "Engine Oil",
            "Solar Panel",
            "Inverter",
            "Battery Accessories"
        ]
    },

    brand:{
        type:String,
        required:true
    },

    stock:{
        type:Number,
        required:true,
        default:0
    },

    capacity:{
        type:String,
        required:true
    },

    warranty:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    actualPrice:{
        type:Number,
        required:true
    },

    discount:{
        type:Number,
        default:0
    },

    description:{
        type:String
    },

    image:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});


module.exports = mongoose.model("Product", productSchema);