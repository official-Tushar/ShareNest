const express = require('express');
const suggestRouter = express.Router();
const citiesData = require('../data/cities.json');

// Flatten all cities into a single array [{ name: 'Delhi', country: 'India' }, ...]
const allCities = [];
citiesData.data.forEach(countryObj => {
  countryObj.cities.forEach(cityName => {
    allCities.push({ name: cityName });
  });
});

suggestRouter.get('/suggest', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q || q.length < 2) return res.json([]);
  const matches = allCities
    .filter(city => city.name.toLowerCase().startsWith(q))
    .slice(0, 10);
  res.json(matches);
});

module.exports = suggestRouter;