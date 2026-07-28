const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({

    orderId:{
        type:String,
        required:true,
        unique:true
    },

    customer:{
        name:{
            type:String,
            required:true
        },

        email:{
            type:String,
            required:true
        },

        phone:{
            type:String,
            required:true
        }
    },


    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },

            name:{
                type:String
            },

            quantity:{
                type:Number
            },

            price:{
                type:Number
            },

            image:{
                type:String
            }
        }
    ],


    shippingAddress:{

        address:{
            type:String,
            required:true
        },

        city:{
            type:String,
            required:true
        },

        state:{
            type:String,
            required:true
        },

        pincode:{
            type:String,
            required:true
        }

    },


    paymentMethod:{
        type:String,
        required:true
    },


    totalAmount:{
        type:Number,
        required:true
    },


    orderStatus:{
        type:String,
        default:"Placed"
    },


    paymentStatus:{
        type:String,
        default:"Pending"
    },


    createdAt:{
        type:Date,
        default:Date.now
    }

});


module.exports = mongoose.model("Order",orderSchema);