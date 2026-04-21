"use client";

import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const HomeAnimation = () => {
  useEffect(() => {
    gsap.to(".animation", {
      ease: "easeInOut",
      scrollTrigger: {
        trigger: ".animation",
        start: "top 100%",
        end: "top 150%",
        scrub: 0.4,
      },
    });
  }, []);

  return (
    <>
      <section className="animation h-screen bg-red-400 w-full">
        <div>hi</div>
      </section>
    </>
  );
};

export default HomeAnimation;
