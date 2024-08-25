"use client";
import axios from "axios";
import mergeImages from "merge-images";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalStyle from "./component/modal/ModalStyle";
import fetchData from "./function/groq/Groq";
import fetchPrompt from "./function/promter/Groq";
import Markdown from "markdown-to-jsx";
import Button from "./component/template/Button";
import Input from "./component/template/Input";
import Navbar from "./component/template/Navbar";
import ModalBudget from "./component/modal/ModalBudget";
import ModalProduct from "./component/modal/ModalProduct";
import { CldUploadWidget } from "next-cloudinary";

const formatNumber = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64.split(",")[1]);
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
    strength: 1,
    control: "depth",
    num_inference_steps: 41,
    cfg: 7.5,
    // negative_prompt:
    //   "painting, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime, furniture, decor, objects, people, animals, text, logos, drawings, reflections, shadows, distortions, not realistict",
    negative_prompt:
      "Furniture, chairs, tables, sofas, household items, artifacts, objects, clutter, imperfections, inconsistencies, distortions, furniture shadows, marks from removed objects. object that doesnt colored white, woman, man, person, human, dark spot, root, black wall, black area, black rectangle, renaicance design, pilar. people, humanoid caracter, alien, princess, bad quality, low resolution, duplicated image, unstructure, duplicated doors, (black object, white object), colorful background, nsfw (child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy, transparent wallpanel, transparent wall",
  });
  const [requiredData, setRequiredData] = useState({
    budget: 0,
    width: 0,
    length: 0,
    hight: 0,
    products: [],
    style: "",
    type: "",
  });

  const [productCount, setProductCount] = useState({
    vinyl: 0,
    wallpanel: 0,
    plafon: 0,
    uv_board: 0,
  });

  const [required, setRequired] = useState([]);
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState("");
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
  const [modalBudgetIsOpen, setModalBudgetIsOpen] = useState(false);
  const [openedModal, setOpenedModal] = useState("");
  const [combineImageUrl, setCombineImageUrl] = useState("");
  const [enought, setEnought] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [harga, setHarga] = useState(0);
  const [budget, setBudget] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log("ini budget", budget);
  const handleInputRequirenment = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "budget") {
      const numericValue = value.replace(/\./g, ""); // Remove existing dots
      const formattedValue = formatNumber(numericValue);
      setRequiredData({ ...requiredData, [name]: formattedValue });
      setBudget(value);
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
      const selected = e.target.files[0];
      setImage(e.target.files[0]);
      setImageUrlUploaded(URL.createObjectURL(selected));
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const productsList = requiredData.products.join(", ");

      const raw = JSON.stringify({
        // pevesindo
        // key: "pzAFP9s7D4yHsnXhzaPxKZtDkfF3BGldnd4s4HIgLUSdkrlisXaFJeRrGDG1",
        //i dont know
        // key: "eeef3lDIFdW8fBz34korJwc2xlCn7TcBEHy9WeWXHJamojWC0Cfmf94NFozr",
        key: "nFYjWffy0omPsKDb8LV6kvSQ46y3azAwUfcaJertHHsatZyG9gYjLe8ua5Lu",
        // prompt:
        // "Remove all furniture from the image, including chairs, tables, sofas, and other household items, leaving behind an empty room with only the walls, floor, and ceiling visible. Ensure that the room remains natural and seamless, with no signs or marks left from where the furniture was removed. Preserve the lighting, shadows, and overall room structure. make the wall white",
        // "turn it into an empty room, clear all the fornitur and all things, and left with only wall and the floor, with full wall colored white, all the floor colored white, the wall and the floor should be flat",
        prompt: `ultra realistic highr resolution ${requiredData.style} ${
          requiredData.type
        } room, add a forniture that will fit into
        ${requiredData.type} room,
        ${
          productsList.includes("uv board")
            ? "In the center of the wall, include a large UV marble panel that features a light cream color with subtle gray veining. The panel should have a polished finish to reflect light softly,"
            : ""
        }
        ${
          productsList.includes("wallpanel")
            ? `at the wall add a vertical panel design featuring narrow, evenly spaced vertical slats in a light wooden texture. Each slat is rectangular and has a consistent height and width, creating a rhythmic pattern across the surface. The slats are positioned closely together, casting subtle shadows in the gaps between them. The background behind the slats is darker, providing contrast and highlighting the light color and fine wood grain texture of the slats. The overall lighting is soft, accentuating the smoothness and natural texture of the wood without harsh reflections`
            : "white wall"
        } and for the floor is
        ${
          productsList.includes("vinyl")
            ? " vinyl floor, The flooring has a natural wood grain pattern with subtle wood patern. The planks are wide, and the surface appears smooth with a matte finish. The wood grain is linear and runs along the length of the planks, giving it a clean and contemporary look. This type of vinyl flooring would be suitable for a modern, minimalist space or any setting that benefits from a warm, natural wood appearance."
            : " a ceramic tile floor. The tiles are large, square, and have a smooth, matte finish. The floor should be white and evenly laid out, creating a clean and modern appearance. The room itself is minimalist, with plain white walls that emphasize the sleek, contemporary look of the ceramic tile flooring."
        } full body, detailed clothing, highly detailed, cinematic lighting, stunningly beautiful, intricate, sharp focus, f/1. 8, 85mm, (centered image composition), (professionally color graded), ((bright soft diffused light)), volumetric fog, trending on instagram, trending on tumblr, HDR 4K, 8K`,
        negative_prompt: formData.negative_prompt || "bad quality",
        init_image: imageUrlUploaded,
        width: "512",
        height: "512",
        samples: "1",
        temp: false,
        safety_checker: false,
        strength: 0.7,
        scheduler: "UniPCMultistepScheduler",
        seed: formData.seed || null,
        webhook: null,
        track_id: null,
        enhance_prompt: true,
        num_inference_steps: 41,
        alpha_matting_foreground_threshold: 300,
        guidance_scale: 7.5,
        lora_strength: 0.9,
        ip_adapter_id: "ip-adapter_sd15",
        ip_adapter_scale: 0.4,
        ip_adapter_image:
          "https://res.cloudinary.com/unm/image/upload/v1724049132/regcoexupcchdfsvtrko.png",
        model_id: "realistic-vision-v13",
        // model_id: "interiordesignsuperm",
        // model_id: "xsachi-interiordesgi"
        // model_id: "dvarch",
        // model_id: "midjourney-v4",
        // model_id: "dream-shaper-8797",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("/api/image-generator-v2", requestOptions);
      // const response = await fetch(
      // "https://modelslab.com/api/v6/realtime/img2img",
      //   "https://modelslab.com/api/v6/images/img2img",
      //   requestOptions
      // );
      // const data = await response.json();
      console.log("inimi responsenya", response);
      // console.log("inimi responsenya", dataImage.data)
      const data = await response.json();
      console.log("ini datanya", data);
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
                // key: "pzAFP9s7D4yHsnXhzaPxKZtDkfF3BGldnd4s4HIgLUSdkrlisXaFJeRrGDG1",
                key: "nFYjWffy0omPsKDb8LV6kvSQ46y3azAwUfcaJertHHsatZyG9gYjLe8ua5Lu",
              });

              const requestOptionsFetch = {
                method: "POST",
                headers: myHeaders,
                body: rawFetch,
                redirect: "follow",
              };

              const responseFetch = await fetch(
                `https://modelslab.com/api/v6/realtime/fetch/${idFetch}`,
                // `https://modelslab.com/api/v6/images/fetch/${idFetch}`,
                requestOptionsFetch
              );

              const dataImage = await responseFetch.json();
              console.log(dataImage);
              if (dataImage.status) {
                if (dataImage.status === "success") {
                  setImageUrl(dataImage.output[0]);
                  console.log(dataImage.output[0]);
                  clearInterval(polling);
                  setLoading(false);
                } else if (dataImage.status === "processing") {
                  console.log("Processing... Please wait.");
                }
              } else {
                setError("Error fetching image status.");
                clearInterval(polling);
                setLoading(false);
              }
            }, pollInterval);
          } catch (error) {
            console.log("Polling error", error);
            setError("Error during polling.");
            setLoading(false);
          }
        };

        pollForImage();
        // } else if (data.status === "success") {
      } else if (data.data.status === "success") {
        // setImageUrl(data.output[0]);
        setImageUrl(data.data.output[0]);
        // setLoading(false);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log("Error", error);
      setError("An error occurred");
      setLoading(false);
    }
    setLoading(false);
  };

  const handleProducts = (e) => {
    console.log("ini product", e);
    if (requiredData.products.includes(e)) {
      setRequiredData((prevData) => {
        if (prevData.products.includes(e)) {
          return {
            ...prevData,
            products: prevData.products.filter((product) => product !== e),
          };
        } else {
          return {
            ...prevData,
            products: [...prevData.products, e],
          };
        }
      });
    } else {
      setOpenedModal(e);

      console.log("ini produknya dari required", requiredData.products);
      console.log("ini produknya dari e");
      openModal();
      setIsActive((prevActive) => (prevActive === e ? null : e));
    }
  };

  const handleType = (e) => {
    setRequiredData({ ...requiredData, ["type"]: e });
  };

  const handleStyle = (e) => {
    setRequiredData({ ...requiredData, ["style"]: e });
  };
  console.log(requiredData);

  const openModalBudget = () => {
    setModalBudgetIsOpen(!modalBudgetIsOpen);
    // setTimeout(() => setModalBudgetIsOpen(false), 3000);
  };

  const saveProductDetail = (status, productName, productDetail) => {
    console.log("ini", productDetail);
    setModalBudgetIsOpen(status);
    setRequiredData((prevData) => {
      if (prevData.products.includes(productName)) {
        return {
          ...prevData,
          products: prevData.products.filter(
            (product) => product !== productName
          ),
        };
      } else {
        return {
          ...prevData,
          products: [...prevData.products, productName],
        };
      }
    });

    console.log("ini Detailnya", productDetail.vinylWidth);
    if (productName === "vinyl") {
      const vinylCount = Math.round(
        (requiredData.width * requiredData.length * 100) / 15 / 0.91
      );
      const dus = vinylCount / productDetail.vinylWidth;
      const final = Math.ceil(dus) * 440000;
      setProductCount((prevState) => ({ ...prevState, vinyl: Math.ceil(dus) }));
      const budgetString = requiredData.budget;
      const cleanedBudgetString = budgetString.replace(/\./g, "");
      const budget = parseInt(cleanedBudgetString, 10);
      const finalCount = budget - final;
      const formattedFinalCount = finalCount.toLocaleString("id-ID");

      if (budget >= final) {
        setProducts((prevProducts) => [
          ...prevProducts,
          { name: "vinyl", quantity: Math.ceil(dus), price: final },
        ]);
        setRequiredData((prevState) => ({
          ...prevState,
          budget: formattedFinalCount,
        }));
      } else {
        setHarga(final);
        setEnought(false);
      }
    } else if (productName === "wallpanel") {
      const wallpanelCount = Math.round(
        (requiredData.width * requiredData.hight * 100) /
          productDetail.wallpanelWidth /
          2.95
      );
      const final = wallpanelCount * 145000;
      const budgetString = requiredData.budget;
      const cleanedBudgetString = budgetString.replace(/\./g, "");
      const budget = parseInt(cleanedBudgetString, 10);
      const jumlahLembar = budget / 145000;
      const finalCountWallpanel = Math.ceil(jumlahLembar);
      const thePrize = finalCountWallpanel * 145000;
      setProductCount((prevState) => ({
        ...prevState,
        wallpanel: finalCountWallpanel,
      }));
      const finalCount = budget - final;
      const formattedFinalCount = finalCount.toLocaleString("id-ID");

      if (budget > finalCount || budget >= final) {
        if (requiredData.products.includes("vinyl")) {
          setProducts((prevProducts) => [
            ...prevProducts,
            {
              name: "wallpanel",
              quantity: finalCountWallpanel,
              price: finalCount,
            },
          ]);
          setRequiredData((prevState) => ({
            ...prevState,
            budget: formattedFinalCount,
          }));
        } else {
          setProducts((prevProducts) => [
            ...prevProducts,
            { name: "wallpanel", quantity: wallpanelCount, price: final },
          ]);
          setRequiredData((prevState) => ({
            ...prevState,
            budget: formattedFinalCount,
          }));
        }
      } else {
        setHarga(final);
        setEnought(false);
      }
    } else if (productName === "plafon") {
      const plafonCount = Math.round(
        (requiredData.width * requiredData.length * 100) /
          20 /
          productDetail.plafonWidth
      );

      const final = Math.ceil(plafonCount) * 300000;
      console.log("iniminya", productDetail.plafonWidth);
      console.log(final);
      const budgetString = requiredData.budget;
      const cleanedBudgetString = budgetString.replace(/\./g, "");
      const budget = parseInt(cleanedBudgetString, 10);
      const finalCount = budget - final;
      const formattedFinalCount = finalCount.toLocaleString("id-ID");

      if (budget >= final) {
        setProducts((prevProducts) => [
          ...prevProducts,
          { name: "plafon", quantity: plafonCount, price: final },
        ]);
        setRequiredData((prevState) => ({
          ...prevState,
          budget: formattedFinalCount,
        }));
      } else {
        setHarga(final);
        setEnought(false);
      }
    } else if (productName === "uv board") {
      const uvCount = Math.round(
        (requiredData.width * requiredData.length * 100) / 15 / 0.91
      );
      const dus = uvCount / 36;
      const final = Math.ceil(dus) * 300000;
      const budgetString = requiredData.budget;
      const cleanedBudgetString = budgetString.replace(/\./g, "");
      const budget = parseInt(cleanedBudgetString, 10);
      console.log("ini Budget", budget);
      const finalCount = budget - final;
      const formattedFinalCount = finalCount.toLocaleString("id-ID");
      if (budget >= final) {
        setProducts((prevProducts) => [
          ...prevProducts,
          { name: "uv board", quantity: uvCount, price: final },
        ]);
        setRequiredData((prevState) => ({
          ...prevState,
          budget: formattedFinalCount,
        }));
      } else {
        setHarga(final);
        setEnought(false);
      }
    }
    setModalBudgetIsOpen(true);
    // setTimeout(() => setModalBudgetIsOpen(false), 3000);
  };

  useEffect(() => {
    if (imageUrlUploaded) {
      mergeImages([
        { src: "/wallpanel-tengah.png" },
        { src: "/wallpanel-kiri.png", opacity: 0.7 },
        { src: "/wallpanel-kanan.png", opacity: 0.7 },
        { src: "/plafon-pvc.png", opacity: 0.7 },
        { src: "/lantai.png", opacity: 0.7 },
      ]).then((b64) => {
        setCombineImageUrl(b64);
      });
    } else {
      console.log("error compile image");
    }
  }, [imageUrlUploaded]);

  console.log(productCount);
  console.log(products);

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  console.log(loading);

  return (
    <div className="flex justify-around relative scroll-smooth md:scroll-auto">
      <ModalBudget
        isOpen={modalBudgetIsOpen}
        budget={requiredData.budget}
        enought={enought}
        harga={harga}
      />
      <ModalProduct
        isOpen={isModalOpen}
        onClose={closeModal}
        save={saveProductDetail}
        opened={openedModal}
      />
      <div className="w-[98%] py-[.8rem] z-1">
        <section>
          <div className="bg-[url('/section.png')] bg-cover bg-center rounded-[10px] px-[5rem] pb-[10rem] pt-[5rem]">
            <div className="w-[60%] space-y-[1rem] text-white">
              <h1 className="text-[3rem] font-semibold leading-[3.8rem]">
                Desain Rumah Lebih Mudah Dengan AI
              </h1>
              <div className="w-[80%] space-y-[1rem]">
                <p className="leading-[1.8rem]">
                  Pevesindo Menyediakan jasa desain interior dalam hitungan
                  menit Menggunakan Teknology AI, Desain Rumah Lebih Cepat dan
                  Mudah
                </p>
                <div
                  className={`h-[3rem] flex justify-around px-[1.5rem] rounded-[10px] text-black ${
                    required.includes("budget")
                      ? "border-[1px] border-red-400 bg-red-200"
                      : "border-[#EDEDED] bg-white"
                  }`}
                >
                  <input
                    name="budget"
                    value={
                      requiredData?.budget !== 0 ? requiredData.budget : " "
                    }
                    onChange={handleInputRequirenment}
                    className={`w-full h-full focus:outline-none focus:ring-0 text-black" placeholder="Masukkan Budget Anda ${
                      required.includes("budget") ? "bg-red-200" : "bg-white"
                    }`}
                  />
                </div>
                <Button className="w-[10rem]" onClick={openModalBudget}>
                  Mulai
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-[1.5rem] font-semibold py-[1.8rem]">
            Ukuran Ruangan
          </h2>
          <div className="flex space-x-[1rem]">
            <div className="w-full">
              <Input value={requiredData.budget}>Budget</Input>
              <p
                className={`py-[.5rem] ${
                  required.includes("type") ? "text-red-400" : ""
                }`}
              >
                Pilih Ruangan
              </p>
              <div className="relative w-full overflow-hidden">
                <div
                  className="w-full h-full grid grid-flow-col transition-transform duration-300 h-[10rem] auto-cols-[13rem] gap-[1rem]"
                  id="slider"
                >
                  <button
                    onClick={(e) => handleType("bedroom")}
                    className="rounded-[10px] bg-[url('/kamar-tidur.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-[10px] ${
                        requiredData.type === "bedroom"
                          ? "bg-gradient-to-t from-black to-transparent"
                          : "bg-gradient-to-t from-black via-transparent to-transparent"
                      }`}
                    />
                    <p className="text-white drop-shadow-md">Kamar Tidur</p>
                  </button>
                  <button
                    onClick={(e) => handleType("family room")}
                    className="rounded-[10px] bg-[url('/ruang-keluarga.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-[10px] ${
                        requiredData.type === "family room"
                          ? "bg-gradient-to-t from-black to-transparent"
                          : "bg-gradient-to-t from-black via-transparent to-transparent"
                      }`}
                    />
                    <p className="text-white drop-shadow-md">Ruang Keluarga</p>
                  </button>
                  <button
                    onClick={(e) => handleType("sitting room")}
                    className="rounded-[10px] bg-[url('/ruang-tamu.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-[10px] ${
                        requiredData.type === "sitting room"
                          ? "bg-gradient-to-t from-black to-transparent"
                          : "bg-gradient-to-t from-black via-transparent to-transparent"
                      }`}
                    />
                    <p className="text-white drop-shadow-md">Ruang Tamu</p>
                  </button>
                  <button
                    onClick={(e) => handleType("office")}
                    className="rounded-[10px] bg-[url('/kantor.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-[10px] ${
                        requiredData.type === "office"
                          ? "bg-gradient-to-t from-black to-transparent"
                          : "bg-gradient-to-t from-black via-transparent to-transparent"
                      }`}
                    />
                    <p className="text-white drop-shadow-md">Kantor</p>
                  </button>
                </div>
              </div>
              <p
                className={`py-[.5rem] ${
                  required.includes("style") ? "text-red-400" : ""
                }`}
              >
                Pilih Style
              </p>
              <div className="relative w-full overflow-hidden">
                <div
                  className="w-full h-full grid grid-flow-col transition-transform duration-300 h-[10rem] auto-cols-[13rem] gap-[1rem]"
                  id="slider"
                >
                  <button
                    onClick={(e) => handleStyle("Modern")}
                    className="rounded-[10px] bg-[url('/modern.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-[10px] ${
                        requiredData.style === "Modern"
                          ? "bg-gradient-to-t from-black to-transparent"
                          : "bg-gradient-to-t from-black via-transparent to-transparent"
                      }`}
                    />
                    <p className="text-white drop-shadow-md">Modern</p>
                  </button>
                  <button
                    onClick={(e) => handleStyle("Industrial")}
                    className="rounded-[10px] bg-[url('/industrial.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-[10px] ${
                        requiredData.style === "Industrial"
                          ? "bg-gradient-to-t from-black to-transparent"
                          : "bg-gradient-to-t from-black via-transparent to-transparent"
                      }`}
                    />
                    <p className="text-white drop-shadow-md">Industrial</p>
                  </button>
                  <button
                    onClick={(e) => handleStyle("Japandi")}
                    className="rounded-[10px] bg-[url('/japandi.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-[10px] ${
                        requiredData.style === "Japandi"
                          ? "bg-gradient-to-t from-black to-transparent"
                          : "bg-gradient-to-t from-black via-transparent to-transparent"
                      }`}
                    />
                    <p className="text-white drop-shadow-md">Japandi</p>
                  </button>
                  <button
                    onClick={(e) => handleStyle("Scandinavian")}
                    className="rounded-[10px] bg-[url('/scandinavian.png')] bg-cover bg-center h-[10rem] p-[1rem] flex items-end relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-[10px] ${
                        requiredData.style === "Scandinavian"
                          ? "bg-gradient-to-t from-black to-transparent"
                          : "bg-gradient-to-t from-black via-transparent to-transparent"
                      }`}
                    />
                    <p className="text-white drop-shadow-md">Scandinavian</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full space-y-[.5rem]">
              <Input
                status={`${required.includes("width") ? "error" : ""}`}
                name="width"
                value={requiredData?.width !== 0 ? requiredData.width : " "}
                onChange={handleInputRequirenment}
              >
                Lebar Ruangan (m)
              </Input>
              <Input
                status={`${required.includes("length") ? "error" : ""}`}
                name="length"
                value={requiredData?.length !== 0 ? requiredData.length : " "}
                onChange={handleInputRequirenment}
              >
                Panjang Ruangan (m)
              </Input>
              <Input
                status={`${required.includes("hight") ? "error" : ""}`}
                name="hight"
                value={requiredData?.hight !== 0 ? requiredData.hight : " "}
                onChange={handleInputRequirenment}
              >
                Tinggi Ruangan (m)
              </Input>
              <div className="flex ">
                <div
                  className={`w-full h-[11.3rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative mt-[1rem] ${
                    required.includes("hight") ? "border-red-400" : ""
                  }`}
                >
                  <CldUploadWidget
                    uploadPreset="pevesindo"
                    onSuccess={(results) => {
                      setImageUrlUploaded(results?.info.url);
                    }}
                  >
                    {({ open }) => {
                      return (
                        <button
                          className={`button ${
                            required.includes("hight") ? "text-red-400" : ""
                          }`}
                          onClick={() => open()}
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
            <h2
              className={`text-[1.5rem] font-semibold ${
                required.includes("products") ? "text-red-400" : ""
              }`}
            >
              Produk
            </h2>
            <p
              className={`${
                required.includes("products") ? "text-red-400 block" : "hidden"
              }`}
            >
              Silahkan Pilih Produk
            </p>
          </div>
          <div className="relative w-full overflow-auto touch-pan-y">
            <div
              className="w-full h-full grid grid-flow-col gap-[1rem] auto-cols-[25rem] transition-transform duration-300"
              id="slider"
            >
              <button
                onClick={() => handleProducts("wallpanel")}
                className={`w-[25rem] h-[15rem] rounded-[10px] bg-[url('/wallpanel.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`}
              >
                <div
                  className={`absolute inset-0 rounded-[10px] ${
                    requiredData.products.includes("wallpanel")
                      ? "bg-gradient-to-t from-black to-transparent"
                      : "bg-gradient-to-t from-black via-transparent to-transparent"
                  }`}
                />
                <p className="pt-full text-white drop-shadow-xl">
                  Wallpanel WPC
                </p>
              </button>
              <button
                onClick={() => handleProducts("vinyl")}
                className={`w-[25rem] h-[15rem] rounded-[10px] bg-[url('/vinyl.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`}
              >
                <div
                  className={`absolute inset-0 rounded-[10px] ${
                    requiredData.products.includes("vinyl")
                      ? "bg-gradient-to-t from-black to-transparent"
                      : "bg-gradient-to-t from-black via-transparent to-transparent"
                  }`}
                />
                <p className="pt-full text-white drop-shadow-xl">Vinyl</p>
              </button>
              <button
                onClick={() => handleProducts("plafon")}
                className={`w-[25rem] h-[15rem] rounded-[10px] bg-[url('/plafon.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`}
              >
                <div
                  className={`absolute inset-0 rounded-[10px] ${
                    requiredData.products.includes("plafon")
                      ? "bg-gradient-to-t from-black to-transparent"
                      : "bg-gradient-to-t from-black via-transparent to-transparent"
                  }`}
                />
                <p className="pt-full text-white drop-shadow-xl">Plafon PVC</p>
              </button>
              <button
                onClick={() => handleProducts("uv board")}
                className={`w-[25rem] h-[15rem] rounded-[10px] bg-[url('/marmer.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`}
              >
                <div
                  className={`absolute inset-0 rounded-[10px] ${
                    requiredData.products.includes("uv board")
                      ? "bg-gradient-to-t from-black to-transparent"
                      : "bg-gradient-to-t from-black via-transparent to-transparent"
                  }`}
                />
                <p className="pt-full text-white drop-shadow-xl">UV Board</p>
              </button>
            </div>
          </div>
        </section>
        <section className="py-[1rem]">
          <Button className="w-full" onClick={handleGenerate}>
            Mulai
          </Button>
        </section>
        <section className="flex space-x-[1rem]">
          {/* <div>
            <Image src={combineImageUrl} width={500} height={500} alt="gambar" className="w-full object-cover object-center z-0 h-[30rem]" />
          </div> */}
          {imageUrlUploaded ? (
            <div className="w-full rounded-[10px] bg-cover bg-center overflow-hidden relative h-[30rem]">
              <Image
                src={imageUrlUploaded}
                width={500}
                height={500}
                alt="gambar"
                className="w-full object-cover object-center z-0 h-[30rem]"
              />
              {/* <Image src="/wallpanel-template.png" width={500} height={500} alt="gambar" className="absolute inset-0 w-[10rem] h-full opacity-90" />
                <Image src="/floor-template.png" width={500} height={500} alt="gambar" className="absolute bottom-0 w-full h-[20%] opacity-90" /> */}
            </div>
          ) : (
            <div className="w-[25rem] h-[20rem] rounded-[10px] bg-cover bg-center w-[50%] overflow-hidden bg-gray-200" />
          )}
          {/* generated image */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={500}
              height={500}
              alt="gambar"
              className="w-full"
            />
          ) : (
            <div className="h-[20rem] rounded-[10px] bg-cover bg-center w-[50%] overflow-hidden border border-[#EDEDED] flex justify-center items-center">
              {loading && (
                <Image
                  src="/loading.png"
                  alt=""
                  width={500}
                  height={500}
                  className="w-[2rem] animate-spin"
                />
              )}
            </div>
          )}
        </section>

        <section className="w-full justify-around flex">
          <div className="w-[80%]">
            <h2 className="text-[1.5rem] font-semibold py-[1.8rem] text-center">
              Deskripsi
            </h2>
            <table className="min-w-full bg-white rounded-md">
              <thead className="bg-gray-200 rounded-md">
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">
                    Nama Produk
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">
                    Jumlah Produk
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">
                    Harga
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800">
                        {product.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800">
                        {formatToRupiah(product.price)}
                      </div>
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
