"use client";
export default function DropDown(props) {
    return (
        <div className="space-y-[.5rem]">
            <label>{props.children}</label>
            <div className="text-white px-[1rem] py-[1rem] rounded-[10px] bg-[#FBFBFB] w-full border border-[#EDEDED]">
                <select
                    onChange={props.onChange}
                    value={props.value}
                    name={props.name}
                    className={`${props.className} w-full focus:outline-none focus:ring-0 text-black bg-[#FBFBFB]`}
                >
                    <option value="" disabled hidden>
                        Select
                    </option>
                    {props.options && props.options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
