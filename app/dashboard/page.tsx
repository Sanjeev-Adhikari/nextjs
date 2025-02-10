"use client"
import React from "react";
import Card from "@/components/card/card";
import { fetchDashboardData, getCards } from "@/hooks/dashboardHooks";

const Page = () => {
  const dashboardData = fetchDashboardData();
  const cards = getCards(dashboardData);

  return (
    <div className="px-6  py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">  
      {cards.map((item, index) => (
        <Card 
          key={index}
          title={item.title}
          count={item.count}
          description={item.description}
          icon={item.icon}
          link={item.link}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default Page;
