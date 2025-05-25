"use client"

import { useState } from "react";
import MainHeader from "./MainHeader";
import DashboardPreview from "./DashboardPreview";

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
        <MainHeader isHovered={isHovered} setIsHovered={setIsHovered} />
        
        <DashboardPreview />
      </div>
    </div>
  );
};

export default HeroSection;