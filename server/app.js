const express = require("express");
const TodoRouter = require("./routes/todo");
const UserRouter = require("./routes/user");
const connectDB = require("./config/db");
connectDB();
const app = express();
const PORT = require("./config/.env").PORT;

app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({ message: "server is running" });
});

app.use("/todo", TodoRouter);
app.use("/user", UserRouter);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => console.log(`Server running At ${PORT}`));
