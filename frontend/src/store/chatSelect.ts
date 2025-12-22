import { create } from "zustand";

interface selectedInfo{
    selectedName:null|string,
    selectedId:null|number,
}
interface selectedChat{
    selected:selectedInfo|null
    setSelected:(state:selectedInfo)=>void
}
export const useChatSelect=create<selectedChat>(
    (set)=>({
        selected:null,
        setSelected:(state)=>set({selected:state})
    })
)