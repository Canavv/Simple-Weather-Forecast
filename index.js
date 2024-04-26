import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;
const apiURL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = process.env.API_KEY;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/weather-report", async (req, res) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date();
  const data = req.body;
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${data.cityName}&limit=1&appid=${apiKey}`
    );
    const result = await axios.get(
      apiURL +
        `?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${apiKey}&units=metric`
    );
    res.render("weather.ejs", {
      data: result.data,
      date: `${d.getDay()} ${month[d.getMonth()]} ${d.getFullYear()}`,
    });
  } catch (error) {
    console.log(error);
    res.render("index.ejs", {
      errormessage:
        "Error: The city you specified could not be found. Please enter the full name of the city and try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
