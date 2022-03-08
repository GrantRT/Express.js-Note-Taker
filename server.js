const express = require('express');
const fs = require('fs');
const path = require('path');
const noteDatabase = require('./db/db.json');
const uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the static folder
app.use(express.static('public'));

// Loads index.html when the page first loads
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Gets the notes.html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// API Routes

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  res.json(noteDatabase);
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uniqid(),
    title: req.body.title,
    text: req.body.text,
  };

  // push the note to db.json
  noteDatabase.push(newNote);

  // write to the db.json file to update the database
  fs.writeFile('./db/db.json', JSON.stringify(noteDatabase), (err) => (err ? console.log(err) : console.log('success')));

  // returns the note to the client
  res.json(noteDatabase);
});

// DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete
app.delete('/api/notes/:id', (req, res) => {
  let noteId = req.params.id;
  let index = noteDatabase.findIndex((note) => note.id === noteId);
  let deletedNote = noteDatabase.splice(index, 1);
  res.send(deletedNote);

  // re-writes the file with updated database
  fs.writeFile('./db/db.json', JSON.stringify(noteDatabase), (err) => (err ? console.log(err) : console.log('success')));
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
