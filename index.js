const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://mpkcujslipoqzhjjinbo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2N1anNsaXBvcXpoamppbmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTg4MDAsImV4cCI6MjA2MTkzNDgwMH0.97k9xCmjE9BiKM9E7FgR1LSse3eH5CsJU0GZ2fbvmrA';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

// CORS configuration (allow all origins in dev, specify in prod)
app.use(cors({
  origin: '*', // For development, in production you should restrict this
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add a new todo
app.post('/add', async (req, res) => {
  const task = req.body.task;
  
  try {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: task }])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all todos
app.get('/get', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Mark todo as complete
app.put('/complete/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!id) {
    return res.status(400).json({ error: 'Invalid ID provided' });
  }
  
  try {
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: true })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(data[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!id) {
    return res.status(400).json({ error: 'Invalid ID provided' });
  }
  
  try {
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// IMPORTANT: For local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}

// Export for Vercel serverless function
module.exports = app;