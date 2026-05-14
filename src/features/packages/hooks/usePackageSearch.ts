import { useEffect, useState } from "react";
import { searchPackages } from "../api/packageRegistryClient";

export function usePackageSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setResults([]);
      setError("");
      setIsSearching(false);
      return undefined;
    }

    let ignore = false;

    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setError("");
        const packages = await searchPackages(normalizedQuery);

        if (!ignore) {
          setResults(packages);
        }
      } catch {
        if (!ignore) {
          setError("Unable to search packages right now.");
        }
      } finally {
        if (!ignore) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    setError,
  };
}
