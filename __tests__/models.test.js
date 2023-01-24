const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");

describe("User model", () => {
  describe("User model", () => {
    it("should create a user with the correct information", () => {
      const user = new User({
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        password: "password",
        membership: true,
      });
      expect(user.first_name).toEqual("John");
      expect(user.last_name).toEqual("Doe");
      expect(user.username).toEqual("johndoe");
      expect(user.password).toEqual("password");
      expect(user.membership).toBe(true);
    });
  });
  it("should not create an incorrect schema", () => {
    expect(User.schema.obj).not.toEqual({
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      username: { type: String, required: true },
      // password field is missing
      membership: { type: Boolean, required: true },
    });
  });
});

describe("Post model", () => {
  it("should create a post with the correct information", () => {
    const date = new Date(2021,11,25,10,15,0);
    const author = new mongoose.Types.ObjectId();
    const post = new Post({
      title: "Example post",
      date: date,
      text: "This is an example post",
      author: author,
    });
    expect(post.title).toEqual("Example post");
    expect(post.date).toEqual(date);
    expect(post.text).toEqual("This is an example post");
    expect(post.author).toEqual(author);
  });
  it("should not create an incorrect schema", () => {
    expect(Post.schema.obj).not.toEqual({
      title: { type: String, required: true },
      date: { type: Date, required: true },
      // text and author fields are missing
    });
  });
});
