const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JwtSecret = require("../config/.env").JWT_SEC;
const ensureAuthenticated = require("../auth/ensureAuthenticated");

router.post("/register", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        res.status(409).json({
          message: "Email Already Used",
        });
      } else {
        bcrypt.hash(req.body.password, 12, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              username: req.body.username,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "user created Successfully",
                });
              })
              .catch((err) => {
                res.status(400).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            JwtSecret,
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            message: "Login Successfully",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth Failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:id", ensureAuthenticated, (req, res, next) => {
  const id = req.params.id;
  User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User Deleted successfully",
        request: {
          type: "POST",
          url: "http://localhost:4000/user",
          body: {
            email: "Email",
            password: "String",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "no user with this id: " + id,
        error: err,
      });
    });
});

module.exports = router;
