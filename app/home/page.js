"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");

    const response = await fetch("/api/image-generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "a cute anime girl in a forest",
        imagePath: "/kamar.png",
      }),
    });

    const data = await response.json();

    if (data.success) {
      setImagePath(data.imagePath);
    } else {
      setError(data.error);
    }

    setLoading(false);
  };
  return (
    <div>
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p>Error: {error}</p>}
      {imagePath && <img src={imagePath} alt="Generated anime girl" />}
    </div>
  );
}
