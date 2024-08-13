"use client";
export default function Input(props) {
    return (
        <div className={`space-y-[.5rem] ${props.className}`}>
            <label className={`${props.status ? "text-red-400" : ""}`}>{props.children} <p className={`text-[.5rem] text-red-500 ${props.status ? "block" : "hidden"}`}>Silahkan Ini Dulu</p></label>
            <div className={`text-white px-[1rem] py-[1rem]  rounded-[10px] bg-[#FBFBFB] w-full border ${props.status ? "border-red-200" : "border-[#EDEDED]"}`}>
                <input onChange={props.onChange} value={props.value} name={props.name} className={`${props.className} w-full focus:outline-none focus:ring-0 text-black bg-[#FBFBFB]`} />
            </div>

        </div>
    )
}