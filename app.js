const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = ["water", "air"];
var item = "";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  var today = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  var day = today.toLocaleDateString("en-US", options);
  var year = today.getFullYear;
  res.render("list", {
    kindOfDay: day,
    newListItems: items,
    items: items,
    year: year,
  });
});

app.post("/", (req, res) => {
  // ADD New Item
  item = req.body.newItem;
  if (item) {
    items.push(item);
  }

  // DELETE button
  console.log(req.body);
  if (req.body.delete) {
    const index = items.indexOf(req.body.delete);
    if (index > -1) {
      // only splice array when item is found
      items.splice(index, 1);
    }
  }

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("server on 3000");
});
