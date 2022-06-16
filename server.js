//const htmlRoutes = require("./routes/htmlRoutes");
//const apiRoutes = require("./routes/apiRoutes");
const fs = require("fs");
const express = require("express");
const notes = require("./db/db.json");
const path = require("path");
const uniqId = require("uniqid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  let noteId = uniqId();
  newNote.id = noteId;

  fs.readFile("./db/db.json", (err, notes) => {
    if (err) throw err;
    const notesArr = JSON.parse(notes);
    notesArr.push(newNote);

    fs.writeFile(
      "./db/db.json",
      JSON.stringify(notesArr, null, 2),
      "utf8",
      (err) => {
        if (err) return console.log(err);
        res.json(newNote);
      }
    );
  });
});

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  fs.readFile("./db/db.json", (err, notes) => {
    if (err) throw err;
    let notesArr = JSON.parse(notes);
    console.log(notesArr[0].id);

    for (let i = 0; i < notesArr.length; i++) {
      if (id === notesArr[i].id) {
        notesArr.splice(i, 1);
      }
    }

    fs.writeFile(
      "./db/db.json",
      JSON.stringify(notesArr, null, 2),
      "utf8",
      (err) => {
        if (err) return console.log(err);
        res.json(`note with id: ${id} has been deleted`);
      }
    );
  });
});

app.get("/api/notes/:id", (req, res) => {
  const index = req.params.id;
  res.json(notes[index]);
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);