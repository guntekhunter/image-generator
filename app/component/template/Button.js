"use client";
export default function Button(props) {
    return(
      <button className={`text-white bg-black ${props.className} p-[1rem] flex justify-around rounded-[10px]`}>
        <p>
        {props.children}
        </p>
      </button>
    )
}