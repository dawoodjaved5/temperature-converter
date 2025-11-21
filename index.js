const express = require("express");
const fs = require("fs");
const path = require("path");
const converter = require("./src/converter");

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, "logs");
const LOG_FILE = path.join(LOG_DIR, "conversions.log");

// Ensure the log directory exists at startup
fs.mkdirSync(LOG_DIR, { recursive: true });

const logConversion = (type, input, result) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} | ${type} | input: ${input} | result: ${result}\n`;
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error("Failed to write conversion log:", err);
    }
  });
};

// Middleware to parse JSON bodies
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Temperature Converter API",
    endpoints: {
      "GET /": "This help message",
      "POST /convert/celsius-to-fahrenheit": "Convert Celsius to Fahrenheit",
      "POST /convert/fahrenheit-to-celsius": "Convert Fahrenheit to Celsius",
      "POST /convert/celsius-to-kelvin": "Convert Celsius to Kelvin",
      "POST /convert/kelvin-to-celsius": "Convert Kelvin to Celsius"
    },
    example: {
      url: "/convert/celsius-to-fahrenheit",
      method: "POST",
      body: { value: 0 }
    }
  });
});

// Celsius to Fahrenheit
app.post("/convert/celsius-to-fahrenheit", (req, res) => {
  const { value } = req.body;
  if (value === undefined || value === null) {
    return res.status(400).json({ error: "Value is required" });
  }
  const result = converter.celsiusToFahrenheit(parseFloat(value));
  const responseBody = {
    from: "Celsius",
    to: "Fahrenheit",
    input: parseFloat(value),
    result: result
  };
  logConversion("celsius-to-fahrenheit", responseBody.input, responseBody.result);
  res.json(responseBody);
});

// Fahrenheit to Celsius
app.post("/convert/fahrenheit-to-celsius", (req, res) => {
  const { value } = req.body;
  if (value === undefined || value === null) {
    return res.status(400).json({ error: "Value is required" });
  }
  const result = converter.fahrenheitToCelsius(parseFloat(value));
  const responseBody = {
    from: "Fahrenheit",
    to: "Celsius",
    input: parseFloat(value),
    result: result
  };
  logConversion("fahrenheit-to-celsius", responseBody.input, responseBody.result);
  res.json(responseBody);
});

// Celsius to Kelvin
app.post("/convert/celsius-to-kelvin", (req, res) => {
  const { value } = req.body;
  if (value === undefined || value === null) {
    return res.status(400).json({ error: "Value is required" });
  }
  const result = converter.celsiusToKelvin(parseFloat(value));
  const responseBody = {
    from: "Celsius",
    to: "Kelvin",
    input: parseFloat(value),
    result: result
  };
  logConversion("celsius-to-kelvin", responseBody.input, responseBody.result);
  res.json(responseBody);
});

// Kelvin to Celsius
app.post("/convert/kelvin-to-celsius", (req, res) => {
  const { value } = req.body;
  if (value === undefined || value === null) {
    return res.status(400).json({ error: "Value is required" });
  }
  const result = converter.kelvinToCelsius(parseFloat(value));
  const responseBody = {
    from: "Kelvin",
    to: "Celsius",
    input: parseFloat(value),
    result: result
  };
  logConversion("kelvin-to-celsius", responseBody.input, responseBody.result);
  res.json(responseBody);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Temperature Converter API is running on port ${PORT}`);
});


