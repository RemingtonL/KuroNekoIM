import { create } from "zustand"

interface LoginInfo{
    name:string|null,
    isLogin:boolean
}

interface LoginStatus {
    loginInfo:LoginInfo;
    setLoginStatus:(loginInfo:LoginInfo)=>void;
}
export const useLoginStatus = create<LoginStatus>(
    (set)=>(
        {
            loginInfo:{isLogin:false,name:null},
            setLoginStatus:(State)=>set({loginInfo:State})
        }
    )
);