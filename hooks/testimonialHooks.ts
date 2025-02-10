import { TestimonialData } from "@/interfaces/testimonial";
import { useEffect, useState } from "react";

export const useFetchAllTestimonials = () => {
    const [testimonials, setTestimonials] = useState<TestimonialData[] | null>(null);

    useEffect(() => {
        fetch("/api/testimonial", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched data:", data);
                if (data.success) {
                    setTestimonials(data.data); 
                } else {
                    console.error("Data fetch failed:", data.message);
                }
            })
            .catch((error) => { console.error("Error fetching data:", error); });
    }, []);

    console.log("testimonials", testimonials);
    return testimonials;
};

