import { CardItems } from "@/interfaces/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Card: React.FC<CardItems> = ({ title, count, description, icon, link, color }) => {
  return (
    <Link href={link}>
      <div className="text-white shadow-md rounded-lg p-4 flex flex-col justify-between" style={{ backgroundColor: color }}>
        <div className="flex items-center">
          <Image src={icon} alt="icon" width={40} height={40} />


          <h3 className="text-sm uppercase  font-semibold">{title}</h3>
        </div>
        <div className="mt-2">
          <h1 className="text-2xl font-bold">{count}</h1>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default Card;