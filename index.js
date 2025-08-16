const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/quote", async (req, res) => {
  try {
    const { data, error } = await supabase.from("quotes").select("id, text, author");
    if (error) throw error;
    if (!data || data.length === 0) return res.json({ text: "No quotes yet", author: "" });
    const row = data[Math.floor(Math.random() * data.length)];
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/seed", async (req, res) => {
  try {
    const { error } = await supabase.from("quotes").insert([
      { text: "Stay curious.", author: "Priyanka" },
      { text: "Ship early, learn fast.", author: "Hackathon Coach" },
      { text: "Make it work, then make it better.", author: "Tech Lead" }
    ]);
    if (error) throw error;
    res.json({ status: "seeded" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
