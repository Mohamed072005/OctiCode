import app from "./app";

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error('❌ ERROR: Missing required environment variable: API_KEY');
    process.exit(1); // Exit with failure code
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
    console.log(`🔑 Use X-API-Key header: ${API_KEY}`);
    console.log(`📐 Architecture: Controller -> Service -> Repository`);
});