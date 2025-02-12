
import { CompanyData } from "@/models/companyModel";
import { useEffect, useState } from "react";

export const useFetchAllWorks = () => {
  const [works, setWorks] = useState<CompanyData[] | null>(null);

 const fetchWorks = async () => {
    fetch("/api/company", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        if (data.success) {
          setWorks(data.data); 
        } else {
          console.error("Data fetch failed:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {        
    fetchWorks();           
    }, []);
  return {works, refetchWorks: fetchWorks};
};


