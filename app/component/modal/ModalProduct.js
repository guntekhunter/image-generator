import Button from "../template/Button"
import Input from "../template/Input"

export default function ModalProduct({ isOpen, onClose }) {
    return (
        <div className={`w-full h-[100vh] fixed z-10 flex justify-around pt-[2rem] pb-[5rem]`}>
            <div className="w-[70%] bg-white p-[2rem] rounded-[10px] border border-gray-200 space-y-[1rem]">
                <h2 className="font-semibold text-[1.5rem]">Wallpanel</h2>
                <div className="relative w-full overflow-auto touch-pan-y">
                    <div className="w-full h-full grid grid-flow-col auto-cols-[11.1rem] transition-transform duration-300" id="slider">
                        <button className={`w-[10rem] h-[9rem] rounded-[10px] bg-[url('/wallpanel.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                            <div className={`absolute inset-0 rounded-[10px] `} />
                            <p className="pt-full text-white drop-shadow-xl">Wallpanel WPC</p>
                        </button>
                        <button className={`w-[10rem] h-[9rem] rounded-[10px] bg-[url('/vinyl.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                            <div className={`absolute inset-0 rounded-[10px] `} />
                            <p className="pt-full text-white drop-shadow-xl">Vinyl</p>
                        </button>
                        <button className={`w-[10rem] h-[9rem] rounded-[10px] bg-[url('/plafon.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                            <div className={`absolute inset-0 rounded-[10px] `} />
                            <p className="pt-full text-white drop-shadow-xl">Plafon PVC</p>
                        </button>
                        <button className={`w-[10rem] h-[9rem] rounded-[10px] bg-[url('/marmer.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                            <div className={`absolute inset-0 rounded-[10px] `} />
                            <p className="pt-full text-white drop-shadow-xl">UV Board</p>
                        </button>
                        <button className={`w-[10rem] h-[9rem] rounded-[10px] bg-[url('/marmer.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                            <div className={`absolute inset-0 rounded-[10px] `} />
                            <p className="pt-full text-white drop-shadow-xl">UV Board</p>
                        </button>
                        <button className={`w-[10rem] h-[9rem] rounded-[10px] bg-[url('/marmer.png')] bg-cover bg-center p-[2rem] font-semibold text-[1.5rem] flex items-end relative`} >
                            <div className={`absolute inset-0 rounded-[10px] `} />
                            <p className="pt-full text-white drop-shadow-xl">UV Board</p>
                        </button>
                    </div>
                </div>
                <div className="flex space-x-[1rem]">
                    <Button>Simpan</Button>
                    <Button>Batal</Button>
                </div>
                {/* <Input></Input> */}
            </div>
        </div>
    )
}