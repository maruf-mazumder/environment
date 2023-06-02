const express = require('express')
const router = express.Router()
const Sensordata = require('../models/humidity')

// Getting all
router.get('/', async (req, res) => {
  try {
    const sensrdata = await Sensordata.find()
    res.json(sensrdata)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



// Creating one
router.post('/', async (req, res) => {
  const sensordata = new Sensordata({
    humidity: req.body.humidity,
    temperature: req.body.temperature
  })
  try {
    const newSensordata = await sensordata.save()
    res.status(201).json(newSensordata)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router