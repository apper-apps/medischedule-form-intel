import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ className, children, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-card border border-gray-100 transition-all duration-200",
        hover && "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;