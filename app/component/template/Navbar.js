"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar(props) {
    const [isScrolled, setIsScrolled] = useState(false);
    const route = useRouter()

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
                console.log("uhuy")
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`h-[3rem] w-full flex justify-around border-b-[1px] transition-all duration-300 ${isScrolled ? 'fixed top-0 z-50 bg-white bg-opacity-90 backdrop-filter backdrop-blur-md' : ''}`}>
            <div className="w-[98%] flex">
                <div className="w-[98%] items-center flex font-bold cursor-pointer" onClick={() => route.push("/")}>
                    Pevesindo
                </div>
                <button className="flex h-full w-full items-center justify-end" onClick={() => route.push("/add-product")}>
                    <Image src="/tambah.png" alt="" height={1000} width={1000} className="w-[1rem] h-[1rem] hover:scale-125 transform duration-300" />
                </button>
            </div>

        </div>
    )
}