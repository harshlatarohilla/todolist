const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let items = ["water", "air"];
let item = "";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  let today = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  let day = today.toLocaleDateString("en-US", options);
  let year = today.getFullYear();

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
  if (req.body.delete) {
    const index = items.indexOf(req.body.delete);
    if (index > -1) {
      // only splice array when item is found
      items.splice(index, 1);
    }
  }

  res.redirect("/");
});

app.listen(3000, () => {
  console.log(`Flying on port 3000`);
});
