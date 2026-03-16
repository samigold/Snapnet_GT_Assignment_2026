const { app } = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // Keep startup log simple for local testing.
  console.log(`Task API listening on port ${PORT}`);
});
