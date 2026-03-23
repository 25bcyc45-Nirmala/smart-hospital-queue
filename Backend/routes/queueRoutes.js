const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

let token = 1;

// Generate token and insert patient
const generateToken = async (req, res) => {
  const { name, department, emergency } = req.body;

  const newPatient = {
    token: token++,
    name,
    department,
    emergency
  };

  const { data, error } = await supabase.from("patients").insert([newPatient]);
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({patient: newPatient});
};

// Get full queue
const getQueue = async (req, res) => {
  const { data, error } = await supabase.from("patients").select("*");
  if (error) return res.status(500).json({ error: error.message });

  // Sort: emergency first
  data.sort((a, b) => (b.emergency ? 1 : 0) - (a.emergency ? 1 : 0));
  res.json(data);
};

// Clear queue
const clearQueue = async (req, res) => {
  const { error } = await supabase.from("patients").delete().neq("id", 0);
  token = 1;
  if (error) return res.status(500).json({ error: error.message });
  res.send("Queue cleared");
};

module.exports = { generateToken, getQueue, clearQueue };