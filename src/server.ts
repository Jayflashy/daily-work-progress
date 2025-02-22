import app from './index';

// Port
const PORT = process.env.PORT || 2026;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});
