require("dotenv").config();
const express = require("express")//to establish the server for me
const axios = require("axios")//allows the code to make request to other server or api

const app=express();
const PORT = 8001;
const API_KEY = process.env.OPENWEATHER_API_KEY;//it is taking the api key from .env file
app.get("/",(req,res)=>{
	res.send({
		message:"Weather API is working",
		example:"/weather?city=Kathmandu"//only shows these if i go into localhost without this at the end
	});
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).send("No city name given");

  try {
    const { data } = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      { params: { q: city, units: "metric", appid: API_KEY } }
    );

    const forecast = data.list.slice(0, 5).map(f => ({//only 5 outputs
      date_time: f.dt_txt,
      temp: f.main.temp,
      weather: f.weather[0].description
    }));
    
    let output = `Weather Forecast for ${data.city.name}, ${data.city.country}:\n\n`;
    forecast.forEach(f => {
      output += `Date & Time: ${f.date_time}\n`;
      output += `Temperature: ${f.temp} °C\n`;
      output += `Weather: ${f.weather}\n`;
      output += '------------------------\n';
    });

    res.setHeader('Content-Type', 'text/plain');
    res.send(output);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send({
      error: "Unable to gather the weather data",
      details: err.response?.data || err.message
    });
  }
});
app.listen(PORT, ()=> {
	console.log(`Server is running on http://localhost:${PORT}`);
});
