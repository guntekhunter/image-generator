"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalStyle from "./component/modal/ModalStyle";
import fetchData from "./function/groq/Groq";
import fetchPrompt from "./function/promter/Groq";
import Markdown from "markdown-to-jsx";
import Button from "../app/component/template/Button"
import Input from "../app/component/template/Input"
import Navbar from "../app/component/template/Navbar"

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
  const [imageUrlUploaded, setImageUrlUploaded] = useState("");
  const [error, setError] = useState("");
  const [vinyl, setVinyl] = useState(0);
  const [wallpanel, setWallpanel] = useState(0);
  const [plafon, setPlafon] = useState(0);
  const [summary, setSummary] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [afordable, setAfordable] = useState(0);
  const [budgetAnalysist, setBudgetAnalysist] = useState("");
  const [prompt, setPrompt] = useState("");

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
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0]
      setImage(e.target.files[0]);
      setImageUrlUploaded(URL.createObjectURL(selected))
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

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

    const calculateAffordableUnits = (budget, price) => {
      return Math.floor(budget / price);
    };
    setBudgetAnalysist("");

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
            ${product}:
            harga = RP. ${details.harga}
            panjang = ${details.panjang}
            lebar = ${details.lebar}
            ${details.dus ? `dus = ${details.dus}` : ""}
            Anda dapat membeli ${affordableUnits} unit dengan budget ${requiredData.budget
              }
          `;
          }
          return "";
        })
        .join("\n");

      const inputText = `buat analisa kebutuhan [${requiredData.products.join(
        ", "
      )}], untuk budget ${requiredData.budget
        } ini informasi tentang kebutuhan pengguna:
      panjang ruangan = ${requiredData.length}
      lebar ruangan = ${requiredData.width}
      tinggi ruangan = ${requiredData.hight}
      hanya ini produk yang dapat didapat: 
      ${availableProducts}
  
      berikan kesimpulan dibagian terakhir perhitungan dalam bentuk tabel, berisi nama produk, jumlah lembar, jumlah dus dan harga, pada bagian bawah berikan bagian total, untuk informasi tambahan plafon PVC itu dibeli perlembar, lantai vinyl dibeli perdus, dan wallpanel dibeli perlembar berikan respon dalam bentuk markup language 
      `;

      const handleError = (error) => {
        console.error("Error:", error);
      };

      const handleChunk = (chunk) => {
        setSummary((prev) => prev + chunk);
      };
      fetchData(inputText, handleChunk, handleError)
        .then((response) => {
          setBudgetAnalysist(`response`);
          console.log("ini responsenya", response);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const data = new FormData();
    data.append("prompt", prompt);
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
    console.log("ini bede", data);
    if (prompt) {
      const generate = async () => {
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
        }
      };
      generate();
    } else {
      console.log(error);
    }
  }, [prompt]);

  useEffect(() => {
    if (budgetAnalysist) {
      const prompter = async (e) => {
        console.log(prompter);
        try {
          const inputText = budgetAnalysist;
          const data = fetchPrompt(inputText)
            .then((response) => {
              setPrompt(response.content);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });

          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };
      prompter();
    } else {
      console.log(error);
    }
  }, [budgetAnalysist]);

  const handleProducts = (e) => {
    setRequiredData((prevData) => {
      if (prevData.products.includes(e)) {
        return prevData;
      }
      return {
        ...prevData,
        products: [...prevData.products, e],
      };
    });
  };

  const handleStyle = (e) => {
    setRequiredData({ ...requiredData, ["style"]: e });
  }
  console.log(requiredData)

  return (
    <div className="flex justify-around">
      <div className="w-[98%] py-[.8rem]">
        <section>
          <div className="bg-[url('/section.png')] bg-cover bg-center rounded-[10px] px-[5rem] pb-[10rem] pt-[5rem]">
            <div className="w-[60%] space-y-[1rem] text-white">
              <h1 className="text-[3rem] font-semibold leading-[3.8rem]">Desain Rumah Lebih Mudah Dengan AI</h1>
              <div className="w-[80%] space-y-[1rem]">
                <p className="leading-[1.8rem]">Pevesindo Menyediakan jasa desian interior dalam hitungan menit  Menggunakan Teknology AI, Desain Rumah Lebih Cepat dan Mudah</p>
                <div className="bg-white h-[3rem] flex justify-around px-[1.5rem] rounded-[10px]">
                  <input name="budget"
                    value={requiredData?.budget !== 0 ? requiredData.budget : " "}
                    onChange={handleInputRequirenment} className="w-full h-full focus:outline-none focus:ring-0 text-black" placeholder="Masukkan Budget Anda" />
                </div>
                <Button className="w-[10rem]">Mulai</Button>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-[1.5rem] font-semibold py-[1.8rem]">Produk</h2>
          <div className="relative w-full overflow-hidden">
            <div className="w-full h-full grid grid-flow-col gap-[1rem] auto-cols-[25rem] transition-transform duration-300" id="slider">
              <button onClick={() => handleProducts("wallpanel")} className="w-[25rem] h-[15rem] rounded-[10px] bg-[url('/wallpanel.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative" >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                <p className="pt-full text-white drop-shadow-xl">Wallpanel WPC</p>
              </button>
              <button onClick={() => handleProducts("vinyl")} className="w-[25rem] h-[15rem] rounded-[10px] bg-[url('/vinyl.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative" >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                <p className="pt-full text-white drop-shadow-xl">Vinyl</p>
              </button>
              <button onClick={() => handleProducts("plafon")} className="w-[25rem] h-[15rem] rounded-[10px] bg-[url('/plafon.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative" >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                <p className="pt-full text-white drop-shadow-xl">Plafon PVC</p>
              </button>
              <button onClick={() => handleProducts("uv board")} className="w-[25rem] h-[15rem] rounded-[10px] bg-[url('/marmer.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative" >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                <p className="pt-full text-white drop-shadow-xl">UV Board</p>
              </button>
            </div>
          </div>

        </section>
        <section>
          <h2 className="text-[1.5rem] font-semibold py-[1.8rem]">Produk</h2>
          <div className="flex space-x-[1rem]">
            <div className="w-full">
              <Input>Budget</Input>
              <p className="py-[.5rem]">Pilih Ruangan</p>
              <div className="relative w-full overflow-hidden">
                <div className="w-full h-full grid grid-flow-col transition-transform duration-300 h-[10rem] auto-cols-[13rem] gap-[1rem]" id="slider">
                  <div className="rounded-[10px] bg-[url('/kamar-tidur.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                    <p className="text-white drop-shadow-md">
                      Kamar Tidur
                    </p>
                  </div>
                  <div className="rounded-[10px] bg-[url('/ruang-keluarga.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                    <p className="text-white drop-shadow-md">
                      Ruang Keluarga
                    </p>
                  </div>
                  <div className="rounded-[10px] bg-[url('/ruang-tamu.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                    <p className="text-white drop-shadow-md">
                      Ruang Tamu
                    </p>
                  </div>
                  <div className="rounded-[10px] bg-[url('/kantor.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                    <p className="text-white drop-shadow-md">
                      Kantor
                    </p>
                  </div>
                </div>
              </div>
              <p className="py-[.5rem]">Pilih Style</p>
              <div className="relative w-full overflow-hidden">
                <div className="w-full h-full grid grid-flow-col transition-transform duration-300 h-[10rem] auto-cols-[13rem] gap-[1rem]" id="slider">
                  <button onClick={(e) => handleStyle("Modern")} className="rounded-[10px] bg-[url('/modern.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                    <p className="text-white drop-shadow-md">Modern</p>
                  </button>
                  <button onClick={(e) => handleStyle("Industrial")} className="rounded-[10px] bg-[url('/industrial.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                    <p className="text-white drop-shadow-md">Industrial</p>
                  </button>
                  <button onClick={(e) => handleStyle("Japandi")} className="rounded-[10px] bg-[url('/japandi.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                    <p className="text-white drop-shadow-md">Japandi</p>
                  </button>
                  <button onClick={(e) => handleStyle("Scandinavian")} className="rounded-[10px] bg-[url('/scandinavian.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[10px]" />
                    <p className="text-white drop-shadow-md">Scandinavian</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full space-y-[.5rem]">
              <Input name="width"
                value={requiredData?.width !== 0 ? requiredData.width : " "}
                onChange={handleInputRequirenment}>Lebar Ruangan (m)</Input>
              <Input name="length"
                value={requiredData?.length !== 0 ? requiredData.length : " "}
                onChange={handleInputRequirenment}>Panjang Ruangan (m)</Input>
              <Input name="hight"
                value={requiredData?.hight !== 0 ? requiredData.hight : " "}
                onChange={handleInputRequirenment}>Tinggi Ruangan (m)</Input>
              <div className="flex ">
                <div className="w-full h-[11.3rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative mt-[1rem]">
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg, image/png"
                    onChange={handleImageChange}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                    required
                  />
                  <div className="text-black font-medium p-2 rounded flex justify-center content-center">
                    Masukkan Foto Ruangan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-[1rem]">
          <Button className="w-full" onClick={handleGenerate}>Mulai</Button>
        </section>
        <section className="flex space-x-[1rem]">
          {
            imageUrlUploaded ? (
              <div className="w-[25rem] h-full rounded-[10px] bg-cover bg-center w-[50%] overflow-hidden" >
                <Image src={imageUrlUploaded} width={500} height={500} alt="gambar" className="w-full" />
              </div>
            ) : (
              <div className="w-[25rem] h-[20rem] rounded-[10px] bg-cover bg-center w-[50%] overflow-hidden bg-gray-200" />
            )
          }
          {/* generated image */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {imageUrl ? (
            <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
          ) : (
            <div className="h-[20rem] rounded-[10px] bg-cover bg-center w-[50%] overflow-hidden border border-[#EDEDED]" />
          )}
        </section>

        <section className="w-full justify-around flex">
          <div className="w-[80%]">
            <h2 className="text-[1.5rem] font-semibold py-[1.8rem] text-center">Deskripsi</h2>
            <article className="prose prose-h1:font-bold prose-p:text-[.8rem] prose-li:text-[.8rem] prose-h1:text-[1rem] w-full max-w-screen-2xl">
              <Markdown>{summary}</Markdown>
            </article>
          </div>

        </section>
      </div>
    </div>
    // <div className="space-y-[2rem] flex w-full justify-center py-[2rem] relative">
    //   <ModalStyle isOpen={isModalOpen} onClose={closeModal} />
    //   <div className="w-[90%] space-y-[2rem]">
    //     <h1 className="text-[2rem] font-bold text-center">Selamat Datang</h1>
    //     {/* the input requirenment of the room */}
    //     <div className="space-y-[.5rem]">
    //       <label className="font-bold">Budget</label>
    //       <input
    //         type="text"
    //         name="budget"
    //         value={requiredData?.budget !== 0 ? requiredData.budget : " "}
    //         onChange={handleInputRequirenment}
    //         className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
    //         required
    //       />
    //     </div>
    //     <div className="grid grid-cols-3 gap-4 w-full">
    //       <div className="space-y-[.5rem]">
    //         <label className="font-bold">Panjang Ruangan (m)</label>
    //         <input
    //           type="text"
    //           name="width"
    //           value={requiredData?.width !== 0 ? requiredData.width : " "}
    //           onChange={handleInputRequirenment}
    //           className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
    //           required
    //         />
    //       </div>
    //       <div className="space-y-[.5rem]">
    //         <label className="font-bold">Lebar Ruangan (m)</label>
    //         <input
    //           type="text"
    //           name="length"
    //           value={requiredData?.length !== 0 ? requiredData.length : " "}
    //           onChange={handleInputRequirenment}
    //           className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
    //           required
    //         />
    //       </div>
    //       <div className="space-y-[.5rem]">
    //         <label className="font-bold">Tinggi Ruangan (m)</label>
    //         <input
    //           type="text"
    //           name="hight"
    //           value={requiredData?.hight !== 0 ? requiredData.hight : " "}
    //           onChange={handleInputRequirenment}
    //           className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
    //           required
    //         />
    //       </div>
    //     </div>
    //     <div>{afordable}</div>
    //     {/* products */}
    //     <div className="flex justify-between">
    //       <button
    //         className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative"
    //         onClick={() => handleProducts("vinyl")}
    //       >
    //         <div className="absolute text-center w-full h-full flex items-center justify-center">
    //           <p className="font-bold text-white">Vinyl</p>
    //         </div>
    //         <Image
    //           src="/vinyl.jfif"
    //           width={500}
    //           height={500}
    //           className="w-full"
    //         />
    //       </button>
    //       <button
    //         className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative"
    //         onClick={() => handleProducts("wallpanel")}
    //       >
    //         <div className="absolute text-center w-full h-full flex items-center justify-center">
    //           <p className="font-bold text-white">Wall Panel</p>
    //         </div>
    //         <Image
    //           src="/wallpanel.jfif"
    //           width={500}
    //           height={500}
    //           className="w-full"
    //         />
    //       </button>
    //       <button
    //         className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative"
    //         onClick={() => handleProducts("plafon")}
    //       >
    //         <div className="absolute text-center w-full h-full flex items-center justify-center">
    //           <p className="font-bold text-white">Plafon</p>
    //         </div>
    //         <Image
    //           src="/plafon.jpg"
    //           width={500}
    //           height={500}
    //           className="w-full h-full"
    //         />
    //       </button>
    //     </div>

    //     {/* Pilih Style */}
    //     <div>
    //       <button
    //         className="bg-black p-[2rem] text-white rounded-md w-full"
    //         onClick={openModal}
    //       >
    //         Pilih Style
    //       </button>
    //     </div>
    //     {/* <form onSubmit={handleGenerate}> */}
    //     <div className="flex ">
    //       <div className="w-full h-[5rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative">
    //         <input
    //           type="file"
    //           name="image"
    //           accept="image/jpeg, image/png"
    //           onChange={handleImageChange}
    //           className="absolute opacity-0 w-full h-full cursor-pointer"
    //           required
    //         />
    //         <div className="text-black font-medium p-2 rounded flex justify-center content-center">
    //           Drop file atau klik disini
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex rounded-md space-x-[1rem]">
    //       <input
    //         type="text"
    //         name="prompt"
    //         value={formData.prompt}
    //         onChange={handleInputChange}
    //         className="w-full py-[.5rem] px-[1rem] bg-[#F4F4F4] focus:outline-none focus:ring-0 rounded-md"
    //         required
    //       />

    //       <button
    //         onClick={handleGenerate}
    //         className="bg-[#D9D9D9] h-stretch px-[1rem] rounded-md"
    //       >
    //         Kirim
    //       </button>
    //     </div>
    //     <article className="prose prose-h1:font-bold prose-p:text-[.8rem] prose-li:text-[.8rem] prose-h1:text-[1rem]">
    //       <Markdown>{summary}</Markdown>
    //     </article>
    //     {error && <p style={{ color: "red" }}>{error}</p>}
    //     {imageUrl && (
    //       <div>
    //         <h2>Generated Image:</h2>
    //         <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
    //       </div>
    //     )}
    //   </div>
    //   {/* </form> */}
    // </div>
  );
}
