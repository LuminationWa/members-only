const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    date: { type: Date, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    collection: "Messages",
  }
);

// Virtual for post's URL
PostSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/posts/${this._id}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
