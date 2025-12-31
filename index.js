require("dotenv").config();
const express = require("express")
const axios = require("axios")

const app=express();
const PORT = 8001;
const API_KEY = process.env.OPENWEATHER_API_KEY;
app.get("/",(req,res)=>{
	res.send({
		message:"Weather API is working",
		example:"/weather?city=Kathmandu"
	});
});

app.get("/weather", async (req,res)=>{
	const city = req.query.city;
	if (!city) return res.status(400).send({error:"City name not provided"});

	try{
		const { data } = await axios.get(
			"https://api.openweathermap.org/data/2.5/forecast",
			{
				params:{q:city, units:"metric",appid:API_KEY}
			}
		);
		const forecast = data.list.slice(0, 5).map(f=>({
			date_time: f.dt_txt,
			temp: f.main.temp,
			weather: f.weather[0].description
		}));
		res.send({
			city: data.city.name,
			country:data.city.country,
			forecast
		});
	}
catch (err) {
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
