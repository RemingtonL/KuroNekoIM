import { create } from "zustand"
export interface ChatInfo{
    sender:string|null
    sender_id:number|null
    receiver:string|null
    receiver_id:number|null
    content:string|null
    msg_type:string|null // text,img,file
    content_type:string|null // the type of the content
    file_name:string|null // origin name of the file
}

interface ChatContent{
    chatInfo:ChatInfo[]
    setChatContent:(state:ChatInfo[])=>(void)
}

export const useChatContent = create<ChatContent>((set)=>({
    chatInfo:[] as ChatInfo[],
    setChatContent:(msgs)=>(set(()=>({chatInfo:[...msgs]})))
}))