import { CardItems } from "@/interfaces/card";
import { DashboardData } from "@/interfaces/dashboard";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type ArrowUpRight = /*unresolved*/ any



export const fetchDashboardData = () => {

    
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalWorks: 0,
        totalTestimonials: 0,
        totalInbox: 0,
        totalCategories: 0
    });

    useEffect(() => { fetch("/api/admin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json()).then((data) => {
        if(data.success){
            setDashboardData(data.data);
            console.log()
        }
    }).catch((error) => {
        console.log(error);
    })}, []);

    return dashboardData;
}

export const getCards = (dashboardData: DashboardData): CardItems[] => [
  
        {
            title: "Works",
            count: dashboardData.totalWorks,
            description: "View all your works",
            icon:  "/images/image.png",
            link: "/dashboard/works",
            color: "#10B981"
        },
        {
            title: "Categories",
            count: dashboardData.totalCategories,
            description: "View all your Categories",
            icon: "/images/image.png",
            link: "/dashboard/category",
            color: "#F87171"
        },
        {
            title: "Testimonials",
            count: dashboardData.totalTestimonials,
            description: "View all your testimonials",
            icon: "/images/image.png",
            link: "/dashboard/testimonials",
            color: "#F59E0B"
        },
        {
            title: "Inbox",
            count: dashboardData.totalInbox,
            description: "View all your inbox",
            icon: "/images/image.png",
            link: "/dashboard/inbox",
            color: "#3B82F6"
        }

    ]