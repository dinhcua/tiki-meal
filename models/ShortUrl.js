const mongoose = require("mongoose");
const shortId = require("shortid");
const ShortSchema = new mongoose.Schema(
  {
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate 
    },
    idproduct: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    click: {
        type: Number,
        required: true,
        default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Short", ShortSchema);
