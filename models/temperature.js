const mongoose = require('mongoose')

const temperatureSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: false
  },
  subscribeDate: {
    type: Date,
    required: false,
    default: Date.now
  }
})

module.exports = mongoose.model('temperature', temperatureSchema)