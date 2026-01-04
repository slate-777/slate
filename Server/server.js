const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env variables
dotenv.config();

const app = express();

// -----------------------------
// ✔ Allowed Origins
// -----------------------------
const allowedOrigins = [
    "https://slate-app.eslate.info",   // Production
    "http://localhost:3000",           // Local development
];

// -----------------------------
// ✔ CORS Middleware
// -----------------------------
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("❌ CORS BLOCKED ORIGIN:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));

app.options("*", cors());

// -----------------------------
// Additional Headers (CORS is handled by cors middleware above)
// -----------------------------
app.use((req, res, next) => {
    // Don't set CORS headers here - they're already set by cors() middleware
    // Only set additional headers if needed
    next();
});

// -----------------------------
// JSON Body
// -----------------------------
app.use(express.json());

// -----------------------------
// Uploads
// -----------------------------
const uploadsPath = path.isAbsolute(process.env.DOCS_UPLOADS_PATH)
    ? process.env.DOCS_UPLOADS_PATH
    : path.join(__dirname, process.env.DOCS_UPLOADS_PATH);

app.use("/uploads", (req, res) => {
    try {
        const decodedPath = decodeURIComponent(req.path);
        const filePath = path.join(uploadsPath, decodedPath);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            return res.sendFile(filePath);
        }

        return res.status(404).send("File not found");
    } catch (error) {
        return res.status(500).send("Error processing request");
    }
});

// -----------------------------
// Routes
// -----------------------------
app.use('/auth', require('./routes/auth'));
app.use('/tags', require('./routes/tags'));
app.use('/upload', require('./routes/upload'));
app.use('/settings', require('./routes/settings'));
app.use('/artifacts', require('./routes/artifacts'));
app.use('/schools', require('./routes/schools'));
app.use('/labs', require('./routes/labs'));
app.use('/equipments', require('./routes/equipments'));
app.use('/sessions', require('./routes/sessions'));
app.use('/users', require('./routes/users'));
app.use('/reports', require('./routes/reports'));
app.use('/sathee-students', require('./routes/satheeStudents'));
app.use('/grievances', require('./routes/grievances'));

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 4623;

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
