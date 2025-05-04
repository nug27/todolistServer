const { Sequelize } = require('sequelize');
const { createClient } = require('@supabase/supabase-js');

// Configure the connection to your PostgreSQL database
const sequelize = new Sequelize('todo_db', 'postgres', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

// Supabase configuration
const supabaseUrl = 'https://mpkcujslipoqzhjjinbo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2N1anNsaXBvcXpoamppbmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTg4MDAsImV4cCI6MjA2MTkzNDgwMH0.97k9xCmjE9BiKM9E7FgR1LSse3eH5CsJU0GZ2fbvmrA';
const supabase = createClient(supabaseUrl, supabaseKey);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.supabase = supabase;

// Import models
db.Todo = require('./Todo.js')(sequelize, Sequelize);

module.exports = db;