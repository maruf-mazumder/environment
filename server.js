require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
const { error } = require('console');


app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DATABASE_URL , { useNewUrlParser : true } )
const db = mongoose.connection ;

db.on('error',(error)=>{console.error(error)})
db.once('open', ()=> console.log("Connected to db...."));



app.use(express.json());

// const sensordataRouter = require('./routes/routes')
// app.use('/', sensordataRouter)

const Humidity = require('./models/humidity');
const Temperature = require('./models/temperature');

const mqtt = require('mqtt');
// const MongoClient = require('mongodb').MongoClient;

const client = mqtt.connect('mqtt://test.mosquitto.org', {
  port: 1883
});


client.on('connect', function() {
    console.log('MQTT client connected');
});
  
  const topics = ["insert/humidity" , "insert/temperature"];
  client.subscribe(topics);
  
  client.on('message', async function(topic, message) {
    console.log('Message received on topic ' + topic + ': ' + message.toString());

    if(topic.includes("humidity")){
        const humidity =  parseInt(message.toString());
        const sensordata =  await Humidity.create({
            humidity: humidity
          });
          try {
            const newSensordata = await sensordata.save()
            console.log("sensordata" , newSensordata.toString());
          } catch (err) {
            console.log(err.message);
          }
    }

    if(topic.includes("temperature")){
        const temperature =  parseInt(message.toString());
        const sensordata = await Temperature.create({
            temperature: temperature
          });
        try {
            const newSensordata = await sensordata.save()
            console.log("sensordata" , newSensordata.toString());
          } 
        catch (err) {
            console.log(err.message);
        }
    }

})




app.get('/', async(req, res) => {
        console.log("We are here...");
    const humidity = await Humidity.find().select("humidity");
    const temperature = await Temperature.find().select("temperature");
    // console.log(humidity);

    const chartData = {
        labels: ['1st', '2nd', '3rd', '4th', '5th'],
        datasets: [{
          label: 'Humidity',
          data: humidity.map(obj => obj.humidity),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };

      const temperatureData = {
        labels: ['1st', '2nd', '3rd', '4th', '5th'],
        datasets: [{
          label: 'temperature',
          data: temperature.map(temp => temp.temperature),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)' ,
          borderWidth: 1
        }]
      };

      res.render('index.ejs', {title : "Temperature - Humidity", holdResult: humidity.concat(temperature) , chartData , temperatureData ,humidity , temperature });

})

app.listen(3000 ,  ()=>('server started'));