const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const { formatDistanceToNow } = require('date-fns');

require('dotenv').config();

const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// API Endpoint to Fetch Data
app.post('/messages', async (req, res) => {
  const { authorization } = req.headers;
  const { startDate, endDate, showCompleted, nameFilter } = req.body;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    let query = supabase
      .from('Messages')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false }); // Order by created_at descending

    if (!showCompleted) {
      query = query.eq('is_completed', false);
    }

    if (nameFilter) {
      query = query.or(`first_name.ilike.%${nameFilter}%,last_name.ilike.%${nameFilter}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const formattedData = data.map((message) => ({
      ...message,
      created_at: formatDistanceToNow(new Date(message.created_at), { addSuffix: true }),
    }));

    res.json(formattedData);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/messages/delete', async (req, res) => {
  const { authorization } = req.headers;
  const { ids } = req.body;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  try {
    const { error } = await supabase
      .from('Messages')
      .delete()
      .in('id', ids);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting messages:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/messages/mark-complete', async (req, res) => {
  const { authorization } = req.headers;
  const { ids } = req.body;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  try {
    const { error } = await supabase
      .from('Messages')
      .update({ is_completed: true })
      .in('id', ids);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error marking messages as complete:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start Server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
