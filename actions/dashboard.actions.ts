import { CardItems } from "@/interfaces/card";
import { DashboardData } from "@/interfaces/dashboard";
import { useEffect, useState } from "react";
import {ArrowUpNarrowWide, BookHeart, ChartBarStacked, ChartNoAxesGantt, LayoutDashboard, Logs, Settings, Shuffle, Users } from "lucide-react";
export const fetchDashboardData = () => {

    
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalWorks: 0,
        totalTestimonials: 0,
        totalInbox: 0
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
            icon:  "",
            link: "/dashboard/works",
            color: "#10B981"
        },
        {
            title: "Testimonials",
            count: dashboardData.totalTestimonials,
            description: "View all your testimonials",
            icon: "",
            link: "/dashboard/testimonials",
            color: "#F59E0B"
        },
        {
            title: "Inbox",
            count: dashboardData.totalInbox,
            description: "View all your inbox",
            icon: "",
            link: "/dashboard/inbox",
            color: "#3B82F6"
        }

    ]