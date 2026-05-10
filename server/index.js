import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const SEARCH_LIMIT = 12;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/packages/search", async (request, response) => {
  const query = String(request.query.q || "").trim();

  if (query.length < 2) {
    response.json({ packages: [] });
    return;
  }

  try {
    const registryResponse = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=${SEARCH_LIMIT}`
    );

    if (!registryResponse.ok) {
      response.status(502).json({ message: "NPM registry search failed." });
      return;
    }

    const payload = await registryResponse.json();

    const packages = Array.isArray(payload.objects)
      ? payload.objects
          .map((entry) => entry.package)
          .filter(Boolean)
          .map((pkg) => ({
            name: pkg.name,
            version: pkg.version,
            description: pkg.description || "",
          }))
      : [];

    response.json({ packages });
  } catch (error) {
    response.status(500).json({ message: "Package search error." });
  }
});

app.get("/api/packages/resolve", async (request, response) => {
  const packageName = String(request.query.name || "").trim();

  if (!packageName) {
    response.status(400).json({ message: "Package name is required." });
    return;
  }

  try {
    const packageResponse = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`);

    if (packageResponse.status === 404) {
      response.status(404).json({ message: "Package not found." });
      return;
    }

    if (!packageResponse.ok) {
      response.status(502).json({ message: "Unable to resolve package version." });
      return;
    }

    const payload = await packageResponse.json();
    const latest = payload?.["dist-tags"]?.latest;

    if (!latest) {
      response.status(422).json({ message: "Latest version unavailable." });
      return;
    }

    response.json({
      name: payload.name || packageName,
      version: `^${latest}`,
    });
  } catch (error) {
    response.status(500).json({ message: "Dependency resolution error." });
  }
});

app.listen(PORT, () => {
  console.log(`Package API server listening on http://localhost:${PORT}`);
});
