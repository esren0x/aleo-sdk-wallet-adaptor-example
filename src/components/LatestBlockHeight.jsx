import React, { useState, useEffect } from "react";

const LatestBlockHeight = () => {
  const [blockHeight, setBlockHeight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlockHeight = async () => {
      try {
        const response = await fetch("https://api.explorer.provable.com/v1/mainnet/latest/height");

        // Check if the response is OK (status 200)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // ✅ Debugging: Log the response structure

        if (data) {
          setBlockHeight(data); // ✅ Ensure height exists before updating state
        } else {
          throw new Error("Invalid response structure: Missing 'height' key.");
        }

        setError(null); // Reset error if successful
      } catch (err) {
        console.error("Error fetching block height:", err);
        setError("Failed to fetch latest block height.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlockHeight(); // Fetch on mount

    // Refresh block height every 30 seconds
    const interval = setInterval(fetchBlockHeight, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>📡 Latest Block Height</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p><strong>Height:</strong> {blockHeight}</p>
      )}
    </div>
  );
};

export default LatestBlockHeight;
