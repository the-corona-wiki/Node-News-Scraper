const express = require('express'); // Adding Express
const app = express(); // Initializing Express
const puppeteer = require('puppeteer'); // Adding Puppeteer


// Wrapping the Puppeteer browser logic in a GET request
app.get('/', function(req, res) {

    // Launching the Puppeteer controlled headless browser and navigate to the NYT website
    puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async function(browser) {
        const page = await browser.newPage();
        await page.goto('https://www.nytimes.com/news-event/coronavirus');

        // Targeting the DOM Nodes that contain the updates tidbits
        const summaryNames = await page.$$eval('#collection-coronavirus > section > section:nth-child(2) > div:nth-child(2)', function(summaries) {
        // Mapping each update name to an array
            return summaries.map(function(summary) {
          return summary.innerText.split('\n')
        });
      });

        // Closing the Puppeteer controlled headless browser
        await browser.close();

        // Sending the NYT updates to Postman
        res.send(summaryNames);
    });
});

// Making Express listen on port 7000
app.listen(process.env.PORT || 5000, function() {
  console.log('http://127.0.0.1:5000/.');
});