import React, { JSX } from "react";

export interface CardItems{
    title: string,
    count: number,
    description: string,
    icon:  React.ReactNode  | JSX.Element,
    link: string,
    color: string
 }