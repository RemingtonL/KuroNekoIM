import { create } from "zustand"

interface InputValue {
    inputValue: object | null;
    setValue: (accAndPwd: object) =>void;
}

export const useInputValue = create<InputValue>(
    (set) => ({
        inputValue: null,
        setValue: (accAndPwd) => set({ inputValue: accAndPwd })
    })
);
