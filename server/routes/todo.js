const express = require("express");
const Todo = require("../models/todo");
const router = express.Router();

// All the todo List
router.get("/", (req, res, next) => {
  Todo.find()
    .select("-__v")
    .exec()
    .then((Todos) => {
      const response = {
        count: Todos.length,
        ExistedTodos: Todos.map((todo) => {
          return {
            title: todo.title,
            content: todo.content,
            completed: todo.completed,
            request: {
              type: "GET",
              url: "http://localhost:4000/todo/" + todo._id,
            },
          };
        }),
      };
      res.status(200).json({ response });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get a single Todo
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Todo.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "No Todo found for this Id :" + id,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// Create a single Todo
router.post("/create", (req, res, next) => {
  const todo = Todo({
    title: req.body.title,
    content: req.body.content,
    completed: req.body.completed,
  });
  todo
    .save()
    .then((result) => {
      res.status(201).json({
        message: "A Todo Created successfully",
        CreatedTodo: {
          title: result.title,
          content: result.content,
          request: {
            type: "GET",
            url: "http://localhost:4000/todo/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Edit Todo by Id
router.put("/", (req, res, next) => {});

// Delete Todo by Id
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Todo.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Todo Deleted",
        request: {
          type: "POST",
          url: "http://localhost:4000/todo",
          body: {
            title: "String",
            content: "String",
            completed: "Boolean",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
