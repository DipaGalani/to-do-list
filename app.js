const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB", {
  useNewUrlParser: true,
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Study Mongoose" });
const item2 = new Item({ name: "Apply Mongoose" });
const item3 = new Item({ name: "Check Mongoose" });

const defaultItemArray = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [itemSchema],
});

const List = new mongoose.model("List", listSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  Item.find().then((items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItemArray);
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", list: items });
    }
  });
});

app.get("/:customListName", (req, res) => {
  const { customListName } = req.params;
  const listName = _.capitalize(customListName);
  console.log(listName);

  List.findOne({ name: listName }).then((result) => {
    if (result) {
      res.render("list", { listTitle: result.name, list: result.items });
    } else {
      const newList = new List({
        name: listName,
        items: defaultItemArray,
      });
      newList.save().then((result) => console.log(result));
      res.redirect("/" + listName);
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  const { newToDoItem, listType } = req.body;

  console.log(newToDoItem);
  console.log(listType);

  const newItem = new Item({ name: newToDoItem });

  if (listType === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listType }).then((result) => {
      result.items.push(newItem);
      result.save();
      res.redirect("/" + listType);
    });
  }
});

app.post("/delete", (req, res) => {
  const { checkbox, listType } = req.body;

  if (listType === "Today") {
    Item.findByIdAndRemove(checkbox).then((result) => console.log(result));
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listType },
      { $pull: { items: { _id: checkbox } } }
    ).then((result) => {
      res.redirect("/" + listType);
    });
  }
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});

// Branch: chp35
