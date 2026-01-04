import { create } from "zustand";

interface InputValue {
    inputValue: string | null;
    setValue: (value: string) => void;
}

interface ChatInfo {
    sender: string
    receiver: string
    content: string
    sender_id: number
    receiver_id:number
    msg_type:string|null // text,img,file
    content_type:string|null // the type of the content
    file_name:string|null // origin name of the file
}



export interface ChatRespond {
    msgList: ChatInfo[]
    ok: boolean
}



export const useChatInput = create<InputValue>(
    (set) => ({
        inputValue: null,
        setValue: (state) => (set({ inputValue: state }))
    }
    )
)