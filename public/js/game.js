// Simple client-side health check
async function checkHealth() {
  try {
    const response = await fetch("/health");
    const data = await response.json();
    console.log("🎉 Server health check:", data);
  } catch (error) {
    console.error("❌ Health check failed:", error);
  }
}

// Run health check when page loads
checkHealth();

console.log("🦕 Stage 1: Basic Deno + Oak setup loaded successfully!");
console.log("📋 This is the foundation for our 24-stage tutorial series");
console.log("🎯 Next: Stage 2 will add HTML5 Canvas and basic game structure");
