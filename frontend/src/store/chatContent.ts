import { create } from "zustand"
export interface ChatInfo{
    sender:string|null
    receiver:string|null
    content:string|null
}

interface ChatContent{
    chatInfo:ChatInfo[]
    addChatContent:(state:ChatInfo)=>(void)
}

export const useChatContent = create<ChatContent>((set)=>({
    chatInfo:[] as ChatInfo[],
    addChatContent:(msg)=>(set((state)=>({chatInfo:[...state.chatInfo,msg]})))
}))