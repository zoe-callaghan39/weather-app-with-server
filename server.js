const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Default locations
const defaultLocations = [
  { name: 'Berlin', lat: 52.52, lon: 13.41, country: 'Germany' },
  { name: 'London', lat: 51.51, lon: -0.13, country: 'United Kingdom' },
  { name: 'New York', lat: 40.71, lon: -74.01, country: 'United States' },
  { name: 'Leeds', lat: 53.8, lon: -1.55, country: 'United Kingdom' },
];

// Fetch all locations, and insert defaults if none exist
app.get('/locations', async (req, res) => {
  try {
    let locations = await prisma.location.findMany();

    if (locations.length === 0) {
      // Insert default locations into the database
      await prisma.location.createMany({ data: defaultLocations });
      locations = await prisma.location.findMany();
    }

    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Add a new location
app.post('/locations', async (req, res) => {
  try {
    const { name, lat, lon, country } = req.body;
    const newLocation = await prisma.location.create({
      data: { name, lat, lon, country },
    });
    res.json(newLocation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add location' });
  }
});

// Delete a location
app.delete('/locations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.location.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
