"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    prompt: "",
    style_id: 22,
    seed: "42",
    aspect_ratio: "1:1",
    strength: 50,
    control: "depth",
    steps: 40,
    cfg: 7.5,
    negative_prompt: "No clouds",
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("prompt", formData.prompt);
    data.append("style_id", String(formData.style_id));
    if (image) data.append("image", image);
    if (formData.seed) data.append("seed", String(formData.seed));
    if (formData.aspect_ratio)
      data.append("aspect_ratio", formData.aspect_ratio);
    if (formData.strength) data.append("strength", String(formData.strength));
    if (formData.control) data.append("control", formData.control);
    if (formData.steps) data.append("steps", String(formData.steps));
    if (formData.cfg) data.append("cfg", String(formData.cfg));
    if (formData.negative_prompt)
      data.append("negative_prompt", formData.negative_prompt);

    try {
      const response = await axios.post(
        "https://api.vyro.ai/v1/imagine/api/edits/remix",
        data,
        {
          headers: {
            Authorization: `Bearer vk-TKyXH2GlMDMiE2qBZu08rRi4yiFAQOY2ha3qBkw26L16ZzMC`, // Replace with your actual API token
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
      console.log(imageUrl);
      setError("");
    } catch (error) {
      console.log(error);
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <>
      <form onSubmit={handleGenerate}>
        <div>
          <label>Prompt:</label>
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {imageUrl && (
          <div>
            <h2>Generated Image:</h2>
            <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
          </div>
        )}
      </form>
    </>
  );
}
