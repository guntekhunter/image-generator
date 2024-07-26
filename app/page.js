"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import ModalStyle from "./component/modal/ModalStyle";
import fetchData from "./function/groq/Groq";
import Markdown from "markdown-to-jsx";

const formatNumber = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

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
  const [vinyl, setVinyl] = useState(0);
  const [wallpanel, setWallpanel] = useState(0);
  const [plafon, setPlafon] = useState(0);
  const [summary, setSummary] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [afordable, setAfordable] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputRequirenment = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "budget") {
      const numericValue = value.replace(/\./g, ""); // Remove existing dots
      const formattedValue = formatNumber(numericValue);
      setRequiredData({ ...requiredData, [name]: formattedValue });
      console.log(formattedValue);
    } else if (
      e.target.name === "width" ||
      e.target.name === "length" ||
      e.target.name === "hight"
    ) {
      setRequiredData({ ...requiredData, [name]: value });
    } else {
      setRequiredData({ ...requiredData, [name]: value });
    }
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

    setSummary("");
    const productDetails = {
      wallpanel: {
        harga: 40000, // in RP
        panjang: "2.90 m",
        lebar: "16 cm",
      },
      vinyl: {
        harga: 300000, // in RP
        panjang: "91 cm",
        lebar: "12.2 cm",
        dus: "36 lembar dalam satu dus",
      },
      plafonPVC: {
        harga: 17000, // in RP
        panjang: "6 meter dan 4 meter",
        lebar: "20 cm",
      },
    };

    const handleProducts = (e) => {
      setRequiredData((prevData) => ({
        ...prevData,
        products: [...prevData.products, e].filter(
          (item, index, self) => self.indexOf(item) === index
        ),
      }));
    };

    const calculateAffordableUnits = (budget, price) => {
      return Math.floor(budget / price);
    };

    try {
      const availableProducts = requiredData.products
        .map((product) => {
          const details = productDetails[product];
          if (details) {
            const affordableUnits = calculateAffordableUnits(
              requiredData.budget,
              details.harga
            );
            setAfordable(affordableUnits);
            return `
            
            Anda dapat membeli ${affordableUnits} unit dengan budget ${requiredData.budget}
          `;
          }
          return "";
        })
        .join("\n");

      const inputText = `buat analisa kebutuhan [${requiredData.products.join(
        ", "
      )}], untuk budget ${
        requiredData.budget
      } ini informasi tentang kebutuhan pengguna:
      panjang ruangan = ${requiredData.length}
      lebar ruangan = ${requiredData.width}
      tinggi ruangan = ${requiredData.hight}
      hanya ini produk yang dapat didapat: 
      ${availableProducts}
  
      berikan kesimpulan dibagian terakhir perhitungan dalam bentuk tabel, berisi nama produk, jumlah lembar, jumlah dus dan harga, pada bagian bawah berikan bagian total, untuk informasi tambahan plafon PVC itu dibeli perlembar, lantai vinyl dibeli perdus, dan wallpanel dibeli perlembar berikan respon dalam bentuk markup language 
      `;

      const handleChunk = (chunk) => {
        console.log("Received chunk:", chunk);
        setSummary((prev) => prev + chunk);
        // Handle each chunk of data here
      };
      fetchData(inputText, handleChunk)
        .then((response) => {
          console.log("Fetch data complete:", response);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleProducts = (e) => {
    setRequiredData((prevData) => {
      // Check if the product is already in the array
      if (prevData.products.includes(e)) {
        return prevData; // If it is, return the previous state without changes
      }
      // If not, add the product to the array
      return {
        ...prevData,
        products: [...prevData.products, e],
      };
    });
  };

  console.log(requiredData);
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
            value={requiredData?.budget !== 0 ? requiredData.budget : " "}
            onChange={handleInputRequirenment}
            className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="space-y-[.5rem]">
            <label className="font-bold">Panjang Ruangan (m)</label>
            <input
              type="text"
              name="width"
              value={requiredData?.width !== 0 ? requiredData.width : " "}
              onChange={handleInputRequirenment}
              className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
              required
            />
          </div>
          <div className="space-y-[.5rem]">
            <label className="font-bold">Lebar Ruangan (m)</label>
            <input
              type="text"
              name="length"
              value={requiredData?.length !== 0 ? requiredData.length : " "}
              onChange={handleInputRequirenment}
              className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
              required
            />
          </div>
          <div className="space-y-[.5rem]">
            <label className="font-bold">Tinggi Ruangan (m)</label>
            <input
              type="text"
              name="hight"
              value={requiredData?.hight !== 0 ? requiredData.hight : " "}
              onChange={handleInputRequirenment}
              className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
              required
            />
          </div>
        </div>
        <div>{afordable}</div>
        {/* products */}
        <div className="flex justify-between">
          <button
            className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative"
            onClick={() => handleProducts("vinyl")}
          >
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Vinyl</p>
            </div>
            <Image
              src="/vinyl.jfif"
              width={500}
              height={500}
              className="w-full"
            />
          </button>
          <button
            className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative"
            onClick={() => handleProducts("wallpanel")}
          >
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Wall Panel</p>
            </div>
            <Image
              src="/wallpanel.jfif"
              width={500}
              height={500}
              className="w-full"
            />
          </button>
          <button
            className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative"
            onClick={() => handleProducts("plafon")}
          >
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Plafon</p>
            </div>
            <Image
              src="/plafon.jpg"
              width={500}
              height={500}
              className="w-full h-full"
            />
          </button>
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
        <article className="prose prose-h1:font-bold prose-p:text-[.8rem] prose-li:text-[.8rem] prose-h1:text-[1rem]">
          <Markdown>{summary}</Markdown>
        </article>
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
