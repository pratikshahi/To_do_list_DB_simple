//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose"); //requiring mongoose

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //creating and connecting to DB in localhost

const itemSchema = {
  //creating new moongose schema
  name: String,
};

const Item = mongoose.model("Item", itemSchema); //creating mongoose model

const item1 = new Item({
  //CREATing 2 default data in items collection
  name: "Wellcome to to do list",
});
const item2 = new Item({
  name: "Hit + after you entered your list",
});
const item3 = new Item({
  name: "Hit checkbox to delete list item.",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find(function (err, foundItems) {
    //reading data from db

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        //insert many item to db
        if (err) {
          console.log("error inside insertMany" + err);
        } else {
          console.log("sucessfulliy saved defaultitem to db");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });

  const day = date.getDate();
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  //passing user entered list to db
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const deleteName = req.body.checkbox;

  Item.deleteOne({ name: deleteName }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(deleteName);
      res.redirect("/");
    }
  });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
