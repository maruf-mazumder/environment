const mongoose = require('mongoose')

const humiditySchema = new mongoose.Schema({
  humidity: {
    type: Number,
    required: false
  },
  subscribeDate: {
    type: Date,
    required: false,
    default: Date.now
  }
})

module.exports = mongoose.model('humidity', humiditySchema)