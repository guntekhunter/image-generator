"use client";

import Image from "next/image";

export default function Button(props) {
  return (
    <button onClick={props.onClick} className={`text-white bg-black ${props.className} p-[1rem] flex justify-around rounded-[10px]`}>
      {
        props.loading ? (
          <Image src="/loading.png" alt="" width={500} height={500} className="invert w-[1rem] animate-spin" />
        ) : (
          <p>
            {props.children}
          </p>
        )
      }
    </button>
  )
}