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
import { CldUploadWidget } from 'next-cloudinary';

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
    // negative_prompt: "painting, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime, furniture, decor, objects, people, animals, text, logos, drawings, reflections, shadows, distortions, not realistict ",
    negative_prompt: "wallpanel, tv, human, wood, decoration, bed, chair, forniture, picture, painting, standing man, black square, black rectangle, stuff uther the wall dan floor, blue, rectangle, debris, cotton, white flakes, black line at the wall,",
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

  const [productCount, setProductCount] = useState({
    vinyl: 0,
    wallpanel: 0,
    plafon: 0,
    uv_board: 0
  })

  const [required, setRequired] = useState([])
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
  const [enought, setEnought] = useState(true)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!requiredData.budget || !requiredData.width || !requiredData.length || !requiredData.hight || !requiredData.products || !requiredData.style || !requiredData.type || !imageUrlUploaded) {
      const missingFields = []
      if (!requiredData.budget) missingFields.push('budget');
      if (!requiredData.width) missingFields.push('width');
      if (!requiredData.length) missingFields.push('length');
      if (!requiredData.hight) missingFields.push('hight'); // assuming "hight" is a typo and you meant "height"
      if (!requiredData.products || requiredData.products.length === 0) missingFields.push('products');
      if (!requiredData.style) missingFields.push('style');
      if (!requiredData.type) missingFields.push('type');
      if (!imageUrlUploaded) missingFields.push('image');
      setRequired(missingFields)
    } else {
      e.preventDefault();
      setLoading(true)

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
    }
  };


  useEffect(() => {
    const sendRequest = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const productsList = requiredData.products.join(", ");

        const raw = JSON.stringify({
          // pevesindo api key
          // key: "pzAFP9s7D4yHsnXhzaPxKZtDkfF3BGldnd4s4HIgLUSdkrlisXaFJeRrGDG1",
          // my api key
          // key: "mRamFZhihfu3f7v9chDr9UmvbeFVl5gMTr4iXwsQ3qS7zf57o7L3wUGzQdxB",
          key: "Ree6pQ5WjswCEc0xBtlygTVlBfKqBoaLKD7YKAfikq4pzPXE8dv47A5sDdaz",
          // prompt: prompt,
          prompt: `Transform the room into a completely empty space, removing all furniture, decorations, and objects. Keep only the walls, floor, and ceiling intact, ensuring that the room appears clean and devoid of any items. make a compelitly white clean wall and clean floor`,
          // prompt: `ultra realistic ${requiredData.style} ${requiredData.type} room, add a forniture that will fit into 
          // ${requiredData.type} room, 
          // ${productsList.includes("uv board") ? "In the center of the wall, include a large UV marble panel that features a light cream color with subtle gray veining. The panel should have a polished finish to reflect light softly and add a luxurious touch to the space." : ""} 
          // ${productsList.includes("wallpanel") ? `Create an image of a wooden slat wall panel. The panel is made of light-colored wood, possibly oak, and features vertical slats with equal spacing between them. The slats are thin, elongated, and evenly distributed, creating a uniform pattern. The top of the panel is bordered by a smooth, flat piece of wood that runs horizontally` : "white wall"} and for the floor is
          // ${productsList.includes("vinyl") ? "add a vinyl floor, The flooring has a natural wood grain pattern with subtle wood patern. The planks are wide, and the surface appears smooth with a matte finish. The wood grain is linear and runs along the length of the planks, giving it a clean and contemporary look. This type of vinyl flooring would be suitable for a modern, minimalist space or any setting that benefits from a warm, natural wood appearance." : "featuring a ceramic tile floor. The tiles are large, square, and have a smooth, matte finish. The floor should be white and evenly laid out, creating a clean and modern appearance. The room itself is minimalist, with plain white walls that emphasize the sleek, contemporary look of the ceramic tile flooring."}`,
          negative_prompt: formData.negative_prompt || "bad quality",
          init_image: imageUrlUploaded,
          width: "512",
          height: "512",
          samples: "1",
          temp: false,
          // safety_checker: false,
          safety_checker: true,
          strength: 1,
          // strength: 0.9,
          seed: formData.seed || null,
          webhook: null,
          track_id: null,
          enhance_prompt: true,
          num_inference_steps: 41,
          // guidance_scale: 7,
          guidance_scale: 9,
          // model_id: "interiordesignsuperm"
          // model_id: "xsachi-interiordesgi"
          // model_id: "dvarch"
          // model_id:"midjourney-v4"
          // model_id: "dream-shaper-8797"
        });

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        const response = await fetch("/api/image-generator-v2", requestOptions);
        // const response = await fetch("https://modelslab.com/api/v6/realtime/img2img", requestOptions);
        // const data = await response.json();
        console.log("inimi responsenya", response)
        // console.log("inimi responsenya", dataImage.data)
        const data = await response.json();
        console.log("ini datanya", data)
        // if (data.status === "processing") {
        if (data.data.status === "processing") {
          // const idFetch = data.id;
          const idFetch = data.data.id;

          // Polling function
          const pollForImage = async () => {
            try {
              const pollInterval = 5000; // Poll every 5 seconds
              const polling = setInterval(async () => {
                const rawFetch = JSON.stringify({
                  // pevesindo ap key
                  // key: "pzAFP9s7D4yHsnXhzaPxKZtDkfF3BGldnd4s4HIgLUSdkrlisXaFJeRrGDG1",
                  //my api key
                  // key: "mRamFZhihfu3f7v9chDr9UmvbeFVl5gMTr4iXwsQ3qS7zf57o7L3wUGzQdxB",
                  key: "Ree6pQ5WjswCEc0xBtlygTVlBfKqBoaLKD7YKAfikq4pzPXE8dv47A5sDdaz",
                });

                const requestOptionsFetch = {
                  method: 'POST',
                  headers: myHeaders,
                  body: rawFetch,
                  redirect: 'follow'
                };

                const responseFetch = await fetch(`https://modelslab.com/api/v6/realtime/fetch/${idFetch}`, requestOptionsFetch);

                const dataImage = await responseFetch.json();
                console.log(dataImage)
                if (dataImage.status) {
                  if (dataImage.status === 'success') {
                    setImageUrl(dataImage.output[0]);
                    console.log(dataImage.output[0]);
                    clearInterval(polling);
                    setLoading(false)
                  } else if (dataImage.status === 'processing') {
                    console.log('Processing... Please wait.');
                  }
                } else {
                  setError('Error fetching image status.');
                  clearInterval(polling);
                  setLoading(false)
                }
              }, pollInterval);
            } catch (error) {
              console.log('Polling error', error);
              setError('Error during polling.');
              setLoading(false)
            }
          };

          pollForImage();
          // } else if (data.status === "success") {
        } else if (data.data.status === "success") {
          // setImageUrl(data.output[0]);
          setImageUrl(data.data.output[0]);
          setLoading(false)
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.log('Error', error);
        setError("An error occurred");
        setLoading(false)
      }
    };

    if (prompt) {
      sendRequest();
    } else {
      console.log('No prompt provided.');
    }
  }, [prompt, imageUrlUploaded, formData]);

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
    console.log("ini product", e)
    if (requiredData.products.includes(e)) {
      setRequiredData((prevData) => {
        if (prevData.products.includes(e)) {
          return {
            ...prevData,
            products: prevData.products.filter(product => product !== e),
          };
        } else {
          return {
            ...prevData,
            products: [...prevData.products, e],
          };
        }
      });
    } else {
      setOpenedModal(e)

      console.log("ini produknya dari required", requiredData.products)
      console.log("ini produknya dari e",)
      openModal()
      setIsActive((prevActive) => (prevActive === e ? null : e));
    }

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

  const saveProductDetail = (status, productName, productDetail) => {
    setModalBudgetIsOpen(status)
    setRequiredData((prevData) => {
      if (prevData.products.includes(productName)) {
        return {
          ...prevData,
          products: prevData.products.filter(product => product !== productName),
        };
      } else {
        return {
          ...prevData,
          products: [...prevData.products, productName],
        };
      }
    });

    console.log("ini Detailnya", productDetail.vinylWidth)
    if (productName === "vinyl") {
      const vinylCount = Math.round((requiredData.width * requiredData.length) * 100 / 15 / 0.91);
      const dus = vinylCount / productDetail.vinylWidth;
      const final = Math.ceil(dus) * 440000;
      setProductCount(prevState => ({ ...prevState, vinyl: Math.ceil(dus) }))
      const budgetString = requiredData.budget
      const cleanedBudgetString = budgetString.replace(/\./g, '');
      const budget = parseInt(cleanedBudgetString, 10);
      const finalCount = (budget - final);
      const formattedFinalCount = finalCount.toLocaleString('id-ID');

      if (budget > final) {
        setProducts(prevProducts => [
          ...prevProducts,
          { name: "vinyl", quantity: Math.ceil(dus), price: final }
        ]);
        setRequiredData(prevState => ({ ...prevState, budget: formattedFinalCount }));
      } else {
        setEnought(false)
      }
    } else if (productName === "wallpanel") {
      const wallpanelCount = Math.round((requiredData.width * requiredData.hight) * 100 / productDetail.wallpanelWidth / 2.95);
      const final = wallpanelCount * 145000;
      const budgetString = requiredData.budget
      const cleanedBudgetString = budgetString.replace(/\./g, '');
      const budget = parseInt(cleanedBudgetString, 10);
      const jumlahLembar = budget / 145000
      const finalCountWallpanel = Math.ceil(jumlahLembar)
      const thePrize = finalCountWallpanel * 145000
      setProductCount(prevState => ({ ...prevState, wallpanel: finalCountWallpanel }))
      const finalCount = (budget - final);
      const formattedFinalCount = finalCount.toLocaleString('id-ID');

      if (budget > finalCount || budget > final) {
        if (requiredData.products.includes("vinyl")) {
          setProducts(prevProducts => [
            ...prevProducts,
            { name: "wallpanel", quantity: finalCountWallpanel, price: finalCount }
          ]);
          setRequiredData(prevState => ({ ...prevState, budget: formattedFinalCount }));
        } else {
          setProducts(prevProducts => [
            ...prevProducts,
            { name: "wallpanel", quantity: wallpanelCount, price: final }
          ]);
          setRequiredData(prevState => ({ ...prevState, budget: formattedFinalCount }));
        }
      } else {
        setEnought(false)
      }

    } else if (productName === "plafon") {
      const plafonCount = Math.round((requiredData.width * requiredData.length) * 100 / 20 / productDetail.plafonWidth);
      const final = Math.ceil(plafonCount) * 300000;
      const budgetString = requiredData.budget
      const cleanedBudgetString = budgetString.replace(/\./g, '');
      const budget = parseInt(cleanedBudgetString, 10);
      const finalCount = (budget - final);
      const formattedFinalCount = finalCount.toLocaleString('id-ID');

      if (budget > final) {
        setProducts(prevProducts => [
          ...prevProducts,
          { name: "plafon", quantity: plafonCount, price: final }
        ]);
        setRequiredData(prevState => ({ ...prevState, budget: formattedFinalCount }));
      } else {
        setEnought(false)
      }
    } else if (productName === "uv board") {
      const uvCount = Math.round((requiredData.width * requiredData.length) * 100 / 15 / 0.91);
      const dus = uvCount / 36;
      const final = Math.ceil(dus) * 300000;
      const budgetString = requiredData.budget
      const cleanedBudgetString = budgetString.replace(/\./g, '');
      const budget = parseInt(cleanedBudgetString, 10);
      console.log("ini Budget", budget)
      const finalCount = (budget - final);
      const formattedFinalCount = finalCount.toLocaleString('id-ID'); if (budget > final) {
        setProducts(prevProducts => [
          ...prevProducts,
          { name: "uv board", quantity: uvCount, price: final }
        ]);
        setRequiredData(prevState => ({ ...prevState, budget: formattedFinalCount }));
      } else {
        setEnought(false)
      }
    }
    setModalBudgetIsOpen(true)
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

  console.log(productCount)
  console.log(products)

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  console.log("inimi ininya",required)

  return (
    <div className="flex justify-around relative scroll-smooth md:scroll-auto">
      <ModalBudget isOpen={modalBudgetIsOpen} budget={requiredData.budget} enought={enought} />
      <ModalProduct isOpen={isModalOpen} onClose={closeModal} save={saveProductDetail} opened={openedModal} />
      <div className="w-[98%] py-[.8rem] z-1">
        <section>
          <div className="bg-[url('/section.png')] bg-cover bg-center rounded-[10px] px-[5rem] pb-[10rem] pt-[5rem]">
            <div className="w-[60%] space-y-[1rem] text-white">
              <h1 className="text-[3rem] font-semibold leading-[3.8rem]">Desain Rumah Lebih Mudah Dengan AI</h1>
              <div className="w-[80%] space-y-[1rem]">
                <p className="leading-[1.8rem]">Pevesindo Menyediakan jasa desain interior dalam hitungan menit  Menggunakan Teknology AI, Desain Rumah Lebih Cepat dan Mudah</p>
                <div className={`h-[3rem] flex justify-around px-[1.5rem] rounded-[10px] text-black ${required.includes("budget") ? "border-[1px] border-red-400 bg-red-200" : "border-[#EDEDED] bg-white"}`}>
                  <input name="budget"
                    value={requiredData?.budget !== 0 ? requiredData.budget : " "}
                    onChange={handleInputRequirenment} className={`w-full h-full focus:outline-none focus:ring-0 text-black" placeholder="Masukkan Budget Anda ${required.includes("budget") ? "bg-red-200" : "bg-white"}`} />
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
              <p className={`py-[.5rem] ${required.includes("type") ? "text-red-400" : ""}`}>Pilih Ruangan</p>
              <div className="relative w-full overflow-hidden">
                <div className="w-full h-full grid grid-flow-col transition-transform duration-300 h-[10rem] auto-cols-[13rem] gap-[1rem]" id="slider">
                  <button onClick={(e) => handleType("bedroom")} className="rounded-[10px] bg-[url('/kamar-tidur.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.type === "bedroom" ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">
                      Kamar Tidur
                    </p>
                  </button>
                  <button onClick={(e) => handleType("family room")} className="rounded-[10px] bg-[url('/ruang-keluarga.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.type === "family room" ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">
                      Ruang Keluarga
                    </p>
                  </button>
                  <button onClick={(e) => handleType("sitting room")} className="rounded-[10px] bg-[url('/ruang-tamu.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.type === "sitting room" ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">
                      Ruang Tamu
                    </p>
                  </button>
                  <button onClick={(e) => handleType("office")} className="rounded-[10px] bg-[url('/kantor.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative" >
                    <div className={`absolute inset-0 rounded-[10px] ${requiredData.type === "office" ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-black via-transparent to-transparent"}`} />
                    <p className="text-white drop-shadow-md">
                      Kantor
                    </p>
                  </button>
                </div>
              </div>
              <p className={`py-[.5rem] ${required.includes("style") ? "text-red-400" : ""}`}>Pilih Style</p>
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
              <Input status={`${required.includes("width") ? "error" : ""}`} name="width"
                value={requiredData?.width !== 0 ? requiredData.width : " "}
                onChange={handleInputRequirenment}>Lebar Ruangan (m)</Input>
              <Input status={`${required.includes("length") ? "error" : ""}`} name="length"
                value={requiredData?.length !== 0 ? requiredData.length : " "}
                onChange={handleInputRequirenment}>Panjang Ruangan (m)</Input>
              <Input status={`${required.includes("hight") ? "error" : ""}`} name="hight"
                value={requiredData?.hight !== 0 ? requiredData.hight : " "}
                onChange={handleInputRequirenment}>Tinggi Ruangan (m)</Input>
              <div className="flex ">
                <div className={`w-full h-[11.3rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative mt-[1rem] ${required.includes("image") ? "border-red-400" : ""}`}>
                <CldUploadWidget
  uploadPreset="pevesindo"
  onSuccess={(results) => setImageUrlUploaded(results?.info.url)}
>
  {({ open }) => {
    return (
      <button
        className={`button ${required.includes("image") ? "text-red-400" : ""}`}
        onClick={() => {
          if (open) {
            open();
          } else {
            console.error("Open function is not available");
          }
        }}
      >
        Upload
      </button>
    );
  }}
</CldUploadWidget>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="py-[1.8rem]">
            <h2 className={`text-[1.5rem] font-semibold ${required.includes("products") ? "text-red-400" : ""}`}>Produk</h2>
            <p className={`${required.includes("products") ? "text-red-400 block" : "hidden"}`}>Silahkan Pilih Produk</p>
          </div>
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
          {/* <div>
            <Image src={combineImageUrl} width={500} height={500} alt="gambar" className="w-full object-cover object-center z-0 h-[30rem]" />
          </div> */}
          {
            imageUrlUploaded ? (
              <div className="w-full rounded-[10px] bg-cover bg-center overflow-hidden relative h-[30rem]">
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
            <Image src={imageUrl} width={500} height={500} alt="gambar" className="w-full" />
          ) : (
            <div className="h-[20rem] rounded-[10px] bg-cover bg-center w-[50%] overflow-hidden border border-[#EDEDED] flex justify-center items-center" >
              {
                loading && (
                  <Image src="/loading.png" alt="" width={500} height={500} className="w-[2rem] animate-spin" />
                )
              }
            </div>
          )}
        </section>

        <section className="w-full justify-around flex">
          <div className="w-[80%]">
            <h2 className="text-[1.5rem] font-semibold py-[1.8rem] text-center">Deskripsi</h2>
            <table className="min-w-full bg-white rounded-md">
              <thead className="bg-gray-200 rounded-md">
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">Nama Produk</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">Jumlah Produk</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">Harga</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr >
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800">{product.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800">{formatToRupiah(product.price)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <article className="prose prose-h1:font-bold prose-p:text-[.8rem] prose-li:text-[.8rem] prose-h1:text-[1rem] w-full max-w-screen-2xl">
              <Markdown>{summary}</Markdown>
            </article>
          </div>

        </section>
      </div>
    </div>

  );
}
