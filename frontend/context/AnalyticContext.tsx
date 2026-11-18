
import {createContext,ReactNode, useContext, useState} from "react";

type ProjectSummary={
    id:string;
    totalCount:number;
    topCountry:string;
    topDevice:string;
    topPlatform:string;
    uniqueViews:number;
    projectName:string;
    longUrl:string;
}
type AnalyticContextType={
    projectSummary:ProjectSummary[];
    setProjectSummary:React.Dispatch<React.SetStateAction<ProjectSummary[]>>;
}
const AnalyticContext=createContext<AnalyticContextType | undefined>(undefined);

export const AnalyticProvider =({ children }: { children: ReactNode })=>{

    const [projectSummary,setProjectSummary]= useState<ProjectSummary[]>([]);
   return  <AnalyticContext.Provider value={{
        projectSummary,
        setProjectSummary
    }
    }>
    {children}
    </AnalyticContext.Provider>
}

export const useAnalytic = (): AnalyticContextType => {
    const context = useContext(AnalyticContext);
    if (context === undefined) {
        throw new Error("useAnalytic must be used within an AnalyticProvider");
    }
    return context;
};

