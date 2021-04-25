import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";
import express, { response } from "express";

const port = process.env.port || 8080

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const url = req.query.url
  const jsonld = await axios(url)
    .then((response) => {
      let recipe;
      const html = response.data;
      const $ = cheerio.load(html);
      const script = JSON.parse($('script[type="application/ld+json"]').html());
      console.log(script);
      if (script["@type"] === "Recipe") recipe = script;
      if (!recipe) {
        console.log("no recipe");
        return "saving not yet implemented for this website";
      }

      return recipe;
    })
    .catch(console.error);

  res.send(jsonld)
});

const server = app.listen(8080, () => {
  console.log(`listening on port: ${port}`)
})

