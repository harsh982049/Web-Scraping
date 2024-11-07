const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const BASE_URL = "https://projecteuler.net/archives";

// Function to scrape problems from a given page number
const scrapeProblemsFromPage = async (pageNumber) => {
    try
    {
        const response = await axios.get(`${BASE_URL};page=${pageNumber}`);
        const html = response.data;
        const $ = cheerio.load(html);

        const problems = [];

        $("tr").each((i, elem) => {
            const id = parseInt($(elem).find("td.id_column").text().trim()); // Problem ID
            const title = $(elem).find("td:nth-child(2)").text().trim(); // Problem Title
            const solvedCount = parseInt($(elem).find("td:nth-child(3) div").text().replace(/,/g, "").trim()); // Solved count, removing commas

            if(!isNaN(id) && title && !isNaN(solvedCount))
            {
                // problems.push({id, title, solvedCount});
                if(solvedCount >= 400)
                {
                    problems.push({id, title, solvedCount});
                }
            }
        });
        // console.log(problems);
        
        return problems;
    }
    catch(error)
    {
        console.error('Error fetching data from page ${pageNumber}: ', error);
        return [];
    }
};

// Route to fetch all problems across all pages
app.get("/problems", async (req, res) => {
    try
    {
        const totalPages = 19; 
        const pagePromises = [];

        for(let i = 1; i <= totalPages; i++)
        {
            pagePromises.push(scrapeProblemsFromPage(i));
        }

        const results = await Promise.all(pagePromises);

        const allProblems = results.flat();

        res.json(allProblems);
    }
    catch(error)
    {
        console.error("Error fetching all problems: ", error);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));