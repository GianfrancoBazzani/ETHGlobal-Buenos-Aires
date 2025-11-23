"use client";

import { useState } from "react";
import PageSelector from "@/components/PageSelector";
import Attack from "@/components/Attack";
import Pots from "@/components/Pots";

export default function Home() {
  const [currentView, setCurrentView] = useState<"default" | "attack" | "pots">("default");

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-black overflow-hidden">
      
      <div className="flex items-center justify-center max-w-[500px] w-auto h-full" id="main-container">
        <img src="/frame.avif" alt="Bleeth" className="w-14 h-full" />
        <div className="w-auto h-full -top-3.5 relative bg-black/50 flex items-center flex-col">
        <video
        autoPlay
        muted
        playsInline
        className={`max-w-[90vw] ${currentView === "default" ? "max-h-[200px]" : "max-h-[100px]"} w-full h-full`}
      >
        <source src="/bleeth-02.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {currentView === "default" && (
        <PageSelector 
          onAttackClick={() => setCurrentView("attack")}
          onPotsClick={() => setCurrentView("pots")}
        />
      )}
      {currentView === "attack" && (
        <Attack onBack={() => setCurrentView("default")} />
      )}
      {currentView === "pots" && (
        <Pots onBack={() => setCurrentView("default")} />
      )}



      
      </div>
        <img src="/frame.avif" alt="Bleeth" className="w-14 h-full rotate-180" />
      </div>
    </div>
  );
}
