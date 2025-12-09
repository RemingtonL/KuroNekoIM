import { create } from "zustand";
interface selectedChat{
    selected:null|string,
    setSelected:(state:string)=>void
}
export const useChatSelect=create<selectedChat>(
    (set)=>({
        selected:null,
        setSelected:(state)=>set({selected:state})
    })
)