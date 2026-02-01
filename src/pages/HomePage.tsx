import React from "react";

import Hero from "../components/Hero";
import Timeline from "../components/Timeline";
import LoveNotes from "../components/LoveNotes";
import PhotoGallery from "../components/PhotoGallery";
import MiniGame from "../components/MiniGame";
import SurpriseReveal from "../components/SurpriseReveal";
import AmbientHearts from "../components/AmbientHearts";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-lavender-50 to-mint-50 font-poppins overflow-x-hidden relative">
      <AmbientHearts />

      <main>
        <Hero />
        <Timeline />
        <LoveNotes />
        <PhotoGallery />
        <MiniGame />
        <SurpriseReveal />
      </main>
    </div>
  );
};

export default HomePage;
