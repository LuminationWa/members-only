const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({ extended: false }));

//Index
router.get("/", function (req, res, next) {
  Post.find({})
    .sort({ date: 1 })
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      res.render("index", { user: req.user, title: "Express", post_list });
    });
});

//Sign up
router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});
router.post(
  "/sign-up",
  [
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    check("confirm-password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        membership: false,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  }
);

//Log in
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

//Lot out
router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//Membership
router.get("/membership", function (req, res, next) {
  res.render("membership", { user: req.user });
});
router.post("/membership", (req, res) => {
  // Handle form data here, for example:
  const reqKeyword = req.body.keyword;
  const keyword = process.env.membership;
  if (reqKeyword === keyword) {
    // Update the user's membership status
    User.findByIdAndUpdate(req.user._id, { membership: true }, (err, user) => {
      if (err) {
        return next(err);
      }
      res.redirect("/membership");
    });
  } else {
    res.render("membership", { user: req.user, error: "Incorrect keyword" });
  }
});

//New post
router.post("/new-post", async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const post = new Post({
      date: new Date().toLocaleDateString(),
      text: req.body.text,
      author: user._id,
    });

    await post.save();
    res.redirect("/");
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
