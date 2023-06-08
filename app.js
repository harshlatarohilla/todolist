const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const itemSchema = new mongoose.Schema({ name: String });
const listSchema = new mongoose.Schema({ name: String, items: [itemSchema] });

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({ name: "Water" });
const item2 = new Item({ name: "Washer" });
const item3 = new Item({ name: "Air" });
const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  Item.find({}).then((result) => {
    //  if(result.length==0){
    if (!result.length) {
      Item.insertMany(defaultItems).then(console.log("Inserted item values"));
      res.redirect("/");
    } else {
      res.render("list", {
        title: "Today",
        newListItems: result,
      });
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }).then((result) => {
    if (!result) {
      const customList = new List({
        name: customListName,
        items: defaultItems,
      });
      customList.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", {
        title: result.name,
        newListItems: result.items,
      });
    }
  });
});

app.post("/", (req, res) => {
  // ADD New Item
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({ name: itemName });

  if (listName == "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((result) => {
      result.items.push(newItem);
      result.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const Id = req.body.checkbox;
  const list = req.body.list;

  if (list === "Today") {
    Item.findByIdAndRemove({ _id: Id }).then(res.redirect("/"));
  } else {
    List.findOneAndUpdate(
      { name: list },
      { $pull: { items: { _id: Id } } }
    ).then(res.redirect("/" + list));
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
