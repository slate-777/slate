const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// =============================
// Load environment variables
// =============================
dotenv.config();

const app = express();

// =============================
// CORS CONFIG (ONLY PLACE)
// =============================
const allowedOrigins = [
    "https://slate-app.eslate.info",
    "http://localhost:3000"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server & tools like Postman
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ❌ DO NOT ADD app.options("*", cors())
// ❌ DO NOT ADD manual CORS headers anywhere else

// =============================
// JSON Body Parser
// =============================
app.use(express.json());

// =============================
// Uploads (Static Files)
// =============================
const defaultUploadsPath = './uploads';
const configuredPath = process.env.DOCS_UPLOADS_PATH || defaultUploadsPath;
const uploadsPath = path.isAbsolute(configuredPath)
    ? configuredPath
    : path.join(__dirname, configuredPath);

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use("/uploads", (req, res) => {
    try {
        const decodedPath = decodeURIComponent(req.path);
        const filePath = path.join(uploadsPath, decodedPath);

        console.log('=== File Request ===');
        console.log('Uploads Path:', uploadsPath);
        console.log('Requested:', decodedPath);
        console.log('Full Path:', filePath);
        console.log('Exists:', fs.existsSync(filePath));

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            return res.sendFile(filePath);
        }

        return res.status(404).send("File not found");
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).send("Error processing request");
    }
});

// =============================
// Routes
// =============================
app.use("/auth", require("./routes/auth"));
app.use("/tags", require("./routes/tags"));
app.use("/upload", require("./routes/upload"));
app.use("/settings", require("./routes/settings"));
app.use("/artifacts", require("./routes/artifacts"));
app.use("/schools", require("./routes/schools"));
app.use("/labs", require("./routes/labs"));
app.use("/equipments", require("./routes/equipments"));
app.use("/sessions", require("./routes/sessions"));
app.use("/users", require("./routes/users"));
app.use("/reports", require("./routes/reports"));
app.use("/sathee-students", require("./routes/satheeStudents"));
app.use("/grievances", require("./routes/grievances"));

// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 4623;

app.listen(PORT, () => {
    console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
});
