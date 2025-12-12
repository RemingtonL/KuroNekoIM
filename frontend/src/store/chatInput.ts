import { create } from "zustand";

interface InputValue {
    inputValue: string | null;
    setValue: (value: string) => void;
}

interface ChatInfo {
    sender: string
    receiver: string
    content: string
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