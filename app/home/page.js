"use client";
import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [formData, setFormData] = useState({
    prompt: "",
    style_id: 22,
    cfg: 7.5,
    inpaint_strength: 0.5,
    neg_prompt: "",
  });
  const [image, setImage] = useState(null);
  const [mask, setMask] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleMaskChange = (e) => {
    setMask(e.target.files[0]);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("prompt", formData.prompt);
    data.append("style_id", String(formData.style_id));
    data.append("cfg", String(formData.cfg));
    data.append("inpaint_strength", String(formData.inpaint_strength));
    data.append("neg_prompt", formData.neg_prompt);

    if (image) data.append("image", image);
    if (mask) data.append("mask", mask);

    try {
      const response = await axios.post(
        "https://api.vyro.ai/v1/imagine/api/edits/inpaint",
        data,
        {
          headers: {
            Authorization: `Bearer vk-lh8QrDyb4Cjw2aTCqUCsu8Jnq4zM9Oic396VBSZNrgZmID`, // Replace with your actual API token
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
    <div className="space-y-[2rem] flex w-full justify-center py-[2rem]">
      <div className="w-[90%] space-y-[2rem]">
        <h1 className="text-[2rem] font-bold text-center">Selamat Datang</h1>
        <div className="flex ">
          <div className="w-full h-[5rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative">
            <input
              type="file"
              name="image"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
              required
            />
            <div className="text-black font-medium p-2 rounded flex justify-center content-center">
              Drop file atau klik disini
            </div>
          </div>
        </div>
        <div className="flex ">
          <div className="w-full h-[5rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative">
            <input
              type="file"
              name="mask"
              accept="image/jpeg, image/png"
              onChange={handleMaskChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
              required
            />
            <div className="text-black font-medium p-2 rounded flex justify-center content-center">
              Drop mask file atau klik disini
            </div>
          </div>
        </div>
        <div className="flex rounded-md space-x-[1rem]">
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleInputChange}
            className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
            required
          />

          <button
            onClick={handleGenerate}
            className="bg-[#D9D9D9] h-stretch px-[1rem] rounded-md"
          >
            Kirim
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {imageUrl && (
          <div>
            <h2>Generated Image:</h2>
            <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
          </div>
        )}
      </div>
    </div>
  );
}
