import { create } from "zustand"

interface LoginInfo{
    isLogin:boolean,
    name:string|null,
    name_id:number|null
}

interface LoginStatus {
    loginInfo:LoginInfo;
    setLoginStatus:(loginInfo:LoginInfo)=>void;
}
export const useLoginStatus = create<LoginStatus>(
    (set)=>(
        {
            loginInfo:{isLogin:false,name:null,name_id:null},
            setLoginStatus:(State)=>set({loginInfo:State})
        }
    )
);