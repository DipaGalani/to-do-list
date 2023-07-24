const express = require("express");
const bodyParser = require("body-parser");

const getDate = require("./date.js");

const app = express();

const toDoItems = [];
const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const day = getDate();
  res.render("list", { listTitle: day, list: toDoItems });
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work", list: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  const { newToDoItem, listType } = req.body;
  if (listType === "Work") {
    workItems.push(newToDoItem);
    res.redirect("/work");
  } else {
    toDoItems.push(newToDoItem);
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});

// Branch: chp35
