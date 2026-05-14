async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  return response.json();
}

export async function searchPackages(query) {
  console.log(`Searching for packages with query: ${query}`);
  const response = await fetch(`/api/packages/search?q=${encodeURIComponent(query)}`);
  const payload = await parseResponse(response, "Package search failed.");

  return Array.isArray(payload.packages) ? payload.packages : [];
}

export async function resolvePackage(packageName) {
  console.log(`Resolving package: ${packageName}`);
  const response = await fetch(`/api/packages/resolve?name=${encodeURIComponent(packageName)}`);
  const payload = await parseResponse(response, "Unable to resolve package version.");

  if (!payload?.name || !payload?.version) {
    throw new Error("Invalid package payload.");
  }

  return {
    name: payload.name,
    version: payload.version,
  };
}
