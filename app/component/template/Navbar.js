"use client";

import { useEffect, useState } from "react";

export default function Navbar(props) {
    const [isScrolled, setIsScrolled] = useState(false);

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
            <div className="w-[98%] items-center flex font-bold " >
                Pevesindo
            </div>
        </div>
    )
}