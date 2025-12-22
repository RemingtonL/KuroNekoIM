import { create } from "zustand"
export interface ChatInfo{
    sender:string|null
    sender_id:number|null
    receiver:string|null
    receiver_id:number|null
    content:string|null
    isText:boolean
}

interface ChatContent{
    chatInfo:ChatInfo[]
    setChatContent:(state:ChatInfo[])=>(void)
}

export const useChatContent = create<ChatContent>((set)=>({
    chatInfo:[] as ChatInfo[],
    setChatContent:(msgs)=>(set(()=>({chatInfo:[...msgs]})))
}))