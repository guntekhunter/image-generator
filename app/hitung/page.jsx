"use client";
import mergeImages from "merge-images";
import Image from "next/image";
import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import Button from "../component/template/Button";
import Input from "../component/template/Input";
import ModalBudget from "../component/modal/ModalBudget";
import ModalProductNew from "../component/modal/ModalProductNew";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formatNumber = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function Home() {
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
  const [summary, setSummary] = useState("");
  const [modalBudgetIsOpen, setModalBudgetIsOpen] = useState(false);
  const [openedModal, setOpenedModal] = useState("");
  const [combineImageUrl, setCombineImageUrl] = useState("");
  const [enought, setEnought] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [harga, setHarga] = useState(0);
  const [budget, setBudget] = useState(0)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputRequirenment = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "budget") {
      const numericValue = value.replace(/\./g, ""); // Remove existing dots
      const formattedValue = formatNumber(numericValue);
      setRequiredData({ ...requiredData, [name]: formattedValue });
      setBudget(value)
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
    console.log("ini",productDetail)
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
        setHarga(final)
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
        setHarga(final)
        setEnought(false);
      }
    } else if (productName === "plafon") {
      const plafonCount = Math.round(
        (requiredData.width * requiredData.length * 100) /
          20 /
          productDetail.plafonWidth
      );

      const final = Math.ceil(plafonCount) * 300000;
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
        setHarga(final)
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
        setHarga(final)
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

  const sendWidth = () => {
    router.push("/3d")
    localStorage.setItem("width", requiredData.width)
    localStorage.setItem("hight", requiredData.hight)
    localStorage.setItem("length", requiredData.length)
  }

  return (
    <div className="flex justify-around relative scroll-smooth md:scroll-auto">
      <ModalBudget
        isOpen={modalBudgetIsOpen}
        budget={requiredData.budget}
        enought={enought}
        harga={harga}
      />
      <ModalProductNew
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
          <div className="grid grid-cols-2 gap-[1rem]">
              <Input value={requiredData.budget}>Budget</Input>
           
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
        <section className="w-full justify-around flex py-[2rem]">
          <div className="w-full">
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
          </div>
        </section>
        <section className="py-[1rem]">
          <Button className="w-full" onClick={sendWidth}>
            Lihat Ruangan
          </Button>
        </section>

      </div>
    </div>
  );
}
