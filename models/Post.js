const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      text: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
      text: true,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
    likes: {
      type: Array,
      required: false,
    },
    comments: [
      {
        text: String,
        image: String,
        postBy: {
          id: String,
          avatar: String
        }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
