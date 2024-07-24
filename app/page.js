"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import ModalStyle from "./component/modal/ModalStyle";

export default function Home() {
  const [formData, setFormData] = useState({
    prompt: "",
    style_id: 22,
    seed: "42",
    aspect_ratio: "1:1",
    strength: 40,
    control: "depth",
    steps: 40,
    cfg: 7.5,
    negative_prompt: "No clouds",
  });
  const [requiredData, setRequiredData] = useState({
    budget: 0,
    width: 0,
    length: 0,
    hight: 0,
    products: [],
    style: "",
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputRequirenment = (e) => {
    const { name, value } = e.target;
    setRequiredData({ ...formData, [name]: value });
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
    <div className="space-y-[2rem] flex w-full justify-center py-[2rem] relative">
      <ModalStyle isOpen={isModalOpen} onClose={closeModal} />
      <div className="w-[90%] space-y-[2rem]">
        <h1 className="text-[2rem] font-bold text-center">Selamat Datang</h1>
        {/* the input requirenment of the room */}
        <div className="space-y-[.5rem]">
          <label className="font-bold">Budget</label>
          <input
            type="text"
            name="budget"
            value={requiredData.budget}
            onChange={handleInputRequirenment}
            className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="space-y-[.5rem]">
            <label className="font-bold">Panjang Ruangan</label>
            <input
              type="text"
              name="width"
              value={requiredData.width}
              onChange={handleInputRequirenment}
              className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
              required
            />
          </div>
          <div className="space-y-[.5rem]">
            <label className="font-bold">Lebar Ruangan</label>
            <input
              type="text"
              name="length"
              value={requiredData.length}
              onChange={handleInputRequirenment}
              className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
              required
            />
          </div>
          <div className="space-y-[.5rem]">
            <label className="font-bold">Tinggi Ruangan</label>
            <input
              type="text"
              name="hight"
              value={requiredData.hight}
              onChange={handleInputRequirenment}
              className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
              required
            />
          </div>
        </div>
        {/* products */}
        <div className="flex justify-between">
          <div className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative">
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Vinyl</p>
            </div>
            <Image
              src="/vinyl.jfif"
              width={500}
              height={500}
              className="w-full"
            />
          </div>
          <div className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative">
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Wall Panel</p>
            </div>
            <Image
              src="/wallpanel.jfif"
              width={500}
              height={500}
              className="w-full"
            />
          </div>
          <div className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative">
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Plafon</p>
            </div>
            <Image
              src="/plafon.jpg"
              width={500}
              height={500}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Pilih Style */}
        <div>
          <button
            className="bg-black p-[2rem] text-white rounded-md w-full"
            onClick={openModal}
          >
            Pilih Style
          </button>
        </div>
        {/* <form onSubmit={handleGenerate}> */}
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

      {/* </form> */}
    </div>
  );
}
