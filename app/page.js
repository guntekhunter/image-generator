"use client";
import axios from "axios";
import mergeImages from 'merge-images';
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalStyle from "./component/modal/ModalStyle";
import fetchData from "./function/groq/Groq";
import fetchPrompt from "./function/promter/Groq";
import Markdown from "markdown-to-jsx";
import Button from "../app/component/template/Button"
import Input from "../app/component/template/Input"
import Navbar from "../app/component/template/Navbar"
import ModalBudget from "../app/component/modal/ModalBudget"
import ModalProduct from "../app/component/modal/ModalProduct"

const formatNumber = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
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
    negative_prompt: "painting, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime, furniture, decor, objects, people, animals, text, logos, drawings, reflections, shadows, distortions, not realistict",
  });
  const [requiredData, setRequiredData] = useState({
    budget: 0,
    width: 0,
    length: 0,
    hight: 0,
    products: [],
    style: "",
    type: ""
  });
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState("")
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
  const [modalBudgetIsOpen, setModalBudgetIsOpen] = useState(false)
  const [openedModal, setOpenedModal] = useState("")
  const [combineImageUrl, setCombineImageUrl] = useState("")

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
          setBudgetAnalysist(`response the style of the room is ${requiredData.style}, the room type is a ${requiredData.type} so only add ${requiredData.products} to the image final design`);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //   const data = new FormData();
    //   const blob = base64ToBlob(combineImageUrl, 'image/png');
    //   data.append("prompt", prompt);
    //   data.append("style_id", String(formData.style_id));
    //   data.append("image", blob, 'combined-image.png');
    //   if (formData.seed) data.append("seed", String(formData.seed));
    //   if (formData.aspect_ratio) data.append("aspect_ratio", formData.aspect_ratio);
    //   if (formData.strength) data.append("strength", String(formData.strength));
    //   if (formData.control) data.append("control", formData.control);
    //   if (formData.steps) data.append("steps", String(formData.steps));
    //   if (formData.cfg) data.append("cfg", String(formData.cfg));
    //   if (formData.negative_prompt) data.append("negative_prompt", formData.negative_prompt);

    //   // const data = new FormData();
    //   // data.append("prompt", prompt);
    //   // data.append("style_id", String(formData.style_id));
    //   // if (image) data.append("image", image);
    //   // if (formData.seed) data.append("seed", String(formData.seed));
    //   // if (formData.aspect_ratio)
    //   //   data.append("aspect_ratio", formData.aspect_ratio);
    //   // if (formData.strength) data.append("strength", String(formData.strength));
    //   // if (formData.control) data.append("control", formData.control);
    //   // if (formData.steps) data.append("steps", String(formData.steps));
    //   // if (formData.cfg) data.append("cfg", String(formData.cfg));
    //   // if (formData.negative_prompt)
    //   //   data.append("negative_prompt", formData.negative_prompt);
    //   // console.log("ini bede", data);
    //   if (prompt) {
    //     const generate = async () => {
    //       try {
    //         const response = await axios.post(
    //           "https://api.vyro.ai/v1/imagine/api/edits/remix",
    //           data,
    //           {
    //             headers: {
    //               Authorization: `Bearer vk-lh8QrDyb4Cjw2aTCqUCsu8Jnq4zM9Oic396VBSZNrgZmID`, // Replace with your actual API token
    //               "Content-Type": "multipart/form-data",
    //             },
    //             responseType: "arraybuffer",
    //           }
    //         );
    //         const blob = new Blob([response.data], { type: "image/png" });
    //         const imageUrls = URL.createObjectURL(blob);
    //         setImageUrl(imageUrls);
    //         setError("");
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
    //     generate();
    //   } else {
    //     console.log(error);
    //   }
    // }, [prompt]);

    if (combineImageUrl && prompt) {
      try {
        const data = new FormData();
        const blob = base64ToBlob(combineImageUrl, 'image/png');
        data.append("prompt", prompt);
        data.append("style_id", String(formData.style_id));
        data.append("image", blob, 'combined-image.png');
        if (formData.seed) data.append("seed", String(formData.seed));
        if (formData.aspect_ratio) data.append("aspect_ratio", formData.aspect_ratio);
        if (formData.strength) data.append("strength", String(formData.strength));
        if (formData.control) data.append("control", formData.control);
        if (formData.steps) data.append("steps", String(formData.steps));
        if (formData.cfg) data.append("cfg", String(formData.cfg));
        if (formData.negative_prompt) data.append("negative_prompt", formData.negative_prompt);

        console.log("FormData before sending:", data);

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
            const imageUrls = URL.createObjectURL(blob);
            setImageUrl(imageUrls);
            setError("");
          } catch (error) {
            console.log('Error generating image:', error);
            setError("Error generating image");
          }
        };
        generate();
      } catch (error) {
        console.log('Error processing image data:', error);
        setError("Error processing image data");
      }
    } else {
      if (!prompt) {
        console.log("Error: prompt is missing");
      }
    }
  }, [combineImageUrl, prompt]);

  useEffect(() => {
    if (budgetAnalysist) {
      const prompter = async (e) => {
        try {
          const inputText = budgetAnalysist;
          const data = fetchPrompt(inputText)
            .then((response) => {
              setPrompt(response.content);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
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
    setOpenedModal(e)
    if (requiredData.products.includes("vinyl") || e === "vinyl") {
      const vinylCount = Math.round((requiredData.width * requiredData.length) * 100 / 15 / 0.91);
      const dus = vinylCount / 36;
      const final = Math.ceil(dus) * 300000;
      const budgetString = requiredData.budget
      const cleanedBudgetString = budgetString.replace(/\./g, '');
      const budget = parseInt(cleanedBudgetString, 10);
      console.log("ini Budget", budget)
      const finalCount = (budget - final);
      const formattedFinalCount = finalCount.toLocaleString('id-ID');
      setRequiredData(prevState => ({ ...prevState, budget: formattedFinalCount }));
      // setModalBudgetIsOpen(true)
      // setTimeout(() => setModalBudgetIsOpen(false), 3000);
    } else {
      console.log("error count floor");
    }
    setRequiredData((prevData) => {
      if (prevData.products.includes(e)) {
        return {
          ...prevData,
          products: prevData.products.filter(product => product !== e),
        };
      } else {
        openModal()
        return {
          ...prevData,
          products: [...prevData.products, e],
        };
      }
    });
    setIsActive((prevActive) => (prevActive === e ? null : e));
  };

  const handleType = (e) => {
    setRequiredData({ ...requiredData, ["type"]: e });
  }

  const handleStyle = (e) => {
    setRequiredData({ ...requiredData, ["style"]: e });
  }
  console.log(requiredData)

  const openModalBudget = () => {
    setModalBudgetIsOpen(!modalBudgetIsOpen)
    setTimeout(() => setModalBudgetIsOpen(false), 3000);
  }

  const saveProductDetail = (e) => {
    setModalBudgetIsOpen(e)
    setTimeout(() => setModalBudgetIsOpen(false), 3000);
  }

  useEffect(() => {
    if (imageUrlUploaded) {
      mergeImages([{ src: '/wallpanel-tengah.png' }, { src: '/wallpanel-kiri.png', opacity: 0.7 }, { src: '/wallpanel-kanan.png', opacity: 0.7 }, { src: '/plafon-pvc.png', opacity: 0.7 }, { src: '/lantai.png', opacity: 0.7 }])
        .then(b64 => {
          setCombineImageUrl(b64);
        });
    } else {
      console.log("error compile image")
    }
  }, [imageUrlUploaded]);

  console.log(image, imageUrlUploaded)
  return (
    <div className="flex justify-around relative">
      <ModalBudget isOpen={modalBudgetIsOpen} budget={requiredData.budget} />
      <ModalProduct isOpen={isModalOpen} onClose={closeModal} save={saveProductDetail} opened={openedModal} />
      <div className="w-[98%] py-[.8rem] z-1">
        <section>
          <div className="bg-[url('/section.png')] bg-cover bg-center rounded-[10px] px-[5rem] pb-[10rem] pt-[5rem]">
            <div className="w-[60%] space-y-[1rem] text-white">
              <h1 className="text-[3rem] font-semibold leading-[3.8rem]">Desain Rumah Lebih Mudah Dengan AI</h1>
              <div className="w-[80%] space-y-[1rem]">
                <p className="leading-[1.8rem]">Pevesindo Menyediakan jasa desain interior dalam hitungan menit  Menggunakan Teknology AI, Desain Rumah Lebih Cepat dan Mudah</p>
                <div className="bg-white h-[3rem] flex justify-around px-[1.5rem] rounded-[10px]">
                  <input name="budget"
                    value={requiredData?.budget !== 0 ? requiredData.budget : " "}
                    onChange={handleInputRequirenment} className="w-full h-full focus:outline-none focus:ring-0 text-black" placeholder="Masukkan Budget Anda" />
                </div>
                <Button className="w-[10rem]" onClick={openModalBudget}>Mulai</Button>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-[1.5rem] font-semibold py-[1.8rem]">Ukuran Ruangan</h2>
          <div className="flex space-x-[1rem]">
            <div className="w-full">
              <Input value={requiredData.budget}>Budget</Input>
              <p className="py-[.5rem]">Pilih Ruangan</p>
              <div className="relative w-full overflow-hidden">
                <div className="w-full h-full grid grid-flow-col transition-transform duration-300 h-[10rem] auto-cols-[13rem] gap-[1rem]" id="slider">
                  <button onClick={(e) => handleType("kamar tidur")} className="rounded-[10px] bg-[url('/kamar-tidur.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.type === "kamar tidur" ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">
                      Kamar Tidur
                    </p>
                  </button>
                  <button onClick={(e) => handleType("ruang keluarga")} className="rounded-[10px] bg-[url('/ruang-keluarga.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.type === "ruang keluarga" ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">
                      Ruang Keluarga
                    </p>
                  </button>
                  <button onClick={(e) => handleType("ruang tamu")} className="rounded-[10px] bg-[url('/ruang-tamu.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.type === "ruang tamu" ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">
                      Ruang Tamu
                    </p>
                  </button>
                  <button onClick={(e) => handleType("kantor")} className="rounded-[10px] bg-[url('/kantor.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.type === "kantor" ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">
                      Kantor
                    </p>
                  </button>
                </div>
              </div>
              <p className="py-[.5rem]">Pilih Style</p>
              <div className="relative w-full overflow-hidden">
                <div className="w-full h-full grid grid-flow-col transition-transform duration-300 h-[10rem] auto-cols-[13rem] gap-[1rem]" id="slider">
                  <button onClick={(e) => handleStyle("Modern")} className="rounded-[10px] bg-[url('/modern.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.style === ("Modern") ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">Modern</p>
                  </button>
                  <button onClick={(e) => handleStyle("Industrial")} className="rounded-[10px] bg-[url('/industrial.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.style === ("Industrial") ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">Industrial</p>
                  </button>
                  <button onClick={(e) => handleStyle("Japandi")} className="rounded-[10px] bg-[url('/japandi.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.style === ("Japandi") ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">Japandi</p>
                  </button>
                  <button onClick={(e) => handleStyle("Scandinavian")} className="rounded-[10px] bg-[url('/scandinavian.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.style === ("Scandinavian") ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
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
        <section>
          <h2 className="text-[1.5rem] font-semibold py-[1.8rem]">Produk</h2>
          <div className="relative w-full overflow-auto touch-pan-y">
            <div className="w-full h-full grid grid-flow-col gap-[1rem] auto-cols-[25rem] transition-transform duration-300" id="slider">
              <button onClick={() => handleProducts("wallpanel")} className={`w-[25rem] h-[15rem] rounded-[10px] bg-[url('/wallpanel.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                <div className={`absolute inset-0 rounded-[10px] ${requiredData.products.includes("wallpanel") ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                <p className="pt-full text-white drop-shadow-xl">Wallpanel WPC</p>
              </button>
              <button onClick={() => handleProducts("vinyl")} className={`w-[25rem] h-[15rem] rounded-[10px] bg-[url('/vinyl.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                <div className={`absolute inset-0 rounded-[10px] ${requiredData.products.includes("vinyl") ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                <p className="pt-full text-white drop-shadow-xl">Vinyl</p>
              </button>
              <button onClick={() => handleProducts("plafon")} className={`w-[25rem] h-[15rem] rounded-[10px] bg-[url('/plafon.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                <div className={`absolute inset-0 rounded-[10px] ${requiredData.products.includes("plafon") ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                <p className="pt-full text-white drop-shadow-xl">Plafon PVC</p>
              </button>
              <button onClick={() => handleProducts("uv board")} className={`w-[25rem] h-[15rem] rounded-[10px] bg-[url('/marmer.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                <div className={`absolute inset-0 rounded-[10px] ${requiredData.products.includes("uv board") ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                <p className="pt-full text-white drop-shadow-xl">UV Board</p>
              </button>
            </div>
          </div>

        </section>
        <section className="py-[1rem]">
          <Button className="w-full" onClick={handleGenerate}>Mulai</Button>
        </section>
        <section className="flex space-x-[1rem]">
          <div>
            <Image src={combineImageUrl} width={500} height={500} alt="gambar" className="w-full object-cover object-center z-0 h-[30rem]" />
          </div>
          {
            imageUrlUploaded ? (
              <div className="w-[25rem] rounded-[10px] bg-cover bg-center overflow-hidden relative h-[30rem]">
                <Image src={imageUrlUploaded} width={500} height={500} alt="gambar" className="w-full object-cover object-center z-0 h-[30rem]" />
                {/* <Image src="/wallpanel-template.png" width={500} height={500} alt="gambar" className="absolute inset-0 w-[10rem] h-full opacity-90" />
                <Image src="/floor-template.png" width={500} height={500} alt="gambar" className="absolute bottom-0 w-full h-[20%] opacity-90" /> */}
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

  );
}
