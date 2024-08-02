export default function ModalBudget({ isOpen, onClose, budget }) {
    return (
        <div className={`fixed flex px-[0.8rem] py-[0.8rem] pointer-events-none top-[3rem] left-[74.4%] z-20 pl-full mr-[.8rem] transition-opacity duration-300 ease-in-out transform ${isOpen ? "opacity-100" : "opacity-0"}`}>
            <div className="w-[20rem] bg-white p-[1rem] rounded-[10px] border border-gray-200 space-y-[1rem]">
                <p className="font-semibold">Ini Budgetmu</p>
                <p className="text-[2rem]">Rp. {budget}</p>
            </div>
        </div>
    )
}