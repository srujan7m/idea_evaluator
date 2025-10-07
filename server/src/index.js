require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const ideaRoutes = require("./routes/ideas");
const evaluationRoutes = require("./routes/evaluations");
const aiRoutes = require("./routes/ai");
const reportRoutes = require("./routes/reports");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/ideas", ideaRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mib_evaluator";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
    process.exit(1);
  });
