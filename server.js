const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'moviesdbs';
const collectionName = 'movies1';

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
MongoClient.connect(mongoUrl, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the application if unable to connect to MongoDB
  }

  const db = client.db(dbName);
  const moviesCollection = db.collection(collectionName);

  // Create a new movie
  app.post('/movies1', async (req, res) => {
    try {
      const newMovie = req.body;
      const result = await moviesCollection.insertOne(newMovie);
      res.json(result.ops[0]);
    } catch (error) {
      console.error('Error creating movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Get all movies
  app.get('/movies1', async (req, res) => {
    try {
      const movies = await moviesCollection.find().toArray();
      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Get a specific movie by ID
  app.get('/movies1/:id', async (req, res) => {
    try {
      const movie = await moviesCollection.findOne({ _id: ObjectId(req.params.id) });
      if (!movie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }
      res.json(movie);
    } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Update a movie by ID
  app.put('/movies1/:id', async (req, res) => {
    try {
      const updatedMovie = req.body;
      const result = await moviesCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: updatedMovie }
      );
      res.json({ modifiedCount: result.modifiedCount });
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Delete a movie by ID
  app.delete('/movies1/:id', async (req, res) => {
    try {
      const result = await moviesCollection.deleteOne({ _id: ObjectId(req.params.id) });
      res.json({ deletedCount: result.deletedCount });
    } catch (error) {
      console.error('Error deleting movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
