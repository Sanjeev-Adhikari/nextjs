import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { JSX } from "react";


export interface CardItems {
    title: string,
    count: number,
    description: string,
    icon: string | StaticImport | JSX.Element,
    link: string,
    color: string
}


// export interface CardItems {
//     title: string;
//     count: number;
//     description: string;
//     icon: string | JSX.Element | StaticImport;  // JSX.Element covers React components like icons
//     link: string;
//     color: string;
//   }