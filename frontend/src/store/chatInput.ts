import { create } from "zustand";

interface InputValue {
    inputValue: string | null;
    setValue: (value: string) =>void;
}

export const useChatInput = create<InputValue>(
   (set)=>({
        inputValue:null,
        setValue:(state)=>(set({inputValue:state}))
    }
   )
)