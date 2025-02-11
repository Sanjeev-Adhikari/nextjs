import { CategoryData } from "@/interfaces/category";
import { useEffect, useState } from "react";

export const useFetchAllCategories = () => {
    const [categories, setCategories] = useState<CategoryData[] | null>(null);

    const fetchcategories = async () => {
        fetch("/api/category", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched data:", data);
                if (data.success) {
                    setCategories(data.data); 
                } else {
                    console.error("Data fetch failed:", data.message);
                }
            })
            .catch((error) => { console.error("Error fetching data:", error); });}

    useEffect(() => {
        fetchcategories();
    }, []);            

    return  { categories, refetchCategories: fetchcategories };;
};