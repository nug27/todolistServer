const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Test Supabase connection
db.supabase.from('todos').select('count()', { count: 'exact' })
  .then(() => {
    console.log('Connected to Supabase successfully');
  })
  .catch(err => {
    console.error('Failed to connect to Supabase:', err);
  });

// Add a new todo
app.post('/add', async (req, res) => {
  const task = req.body.task;
  
  try {
    const { data, error } = await db.supabase
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
    const { data, error } = await db.supabase
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
  
  console.log('Attempting to complete todo with ID:', id);
  
  try {
    const { data, error } = await db.supabase
      .from('todos')
      .update({ completed: true })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    console.log('Updated todo:', data[0]);
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
  
  console.log('Attempting to delete todo with ID:', id);
  
  try {
    const { data, error } = await db.supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    console.log('Deleted todo with ID:', id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});