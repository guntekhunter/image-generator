"use client";
export default function Input(props) {
    return (
        <div className={`space-y-[.5rem] ${props.className}`}>
            <label>{props.children}</label>
            <div className="text-white px-[1rem] py-[1rem]  rounded-[10px] bg-[#FBFBFB] w-full border border-[#EDEDED]">
                <input onChange={props.onChange} value={props.value} name={props.name} className={`${props.className} w-full focus:outline-none focus:ring-0 text-black bg-[#FBFBFB]`} />
            </div>
        </div>
    )
}