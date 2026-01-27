
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    // Center the cursor elements initially
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.1; // Smoothness of the follower

    // Quick setters for performance
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");
    const xFollowSet = gsap.quickSetter(follower, "x", "px");
    const yFollowSet = gsap.quickSetter(follower, "y", "px");

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Immediate movement for the dot
      xSet(mouse.x);
      ySet(mouse.y);
    };

    // Animation Loop for smooth follower
    const loop = () => {
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      
      xFollowSet(pos.x);
      yFollowSet(pos.y);
    };

    window.addEventListener("mousemove", onMouseMove);
    gsap.ticker.add(loop);

    // Interaction States
    const onHover = () => {
      gsap.to(cursor, { scale: 0, duration: 0.1 });
      gsap.to(follower, { 
        scale: 3, 
        backgroundColor: "rgba(0, 243, 255, 0.1)", 
        borderColor: "transparent",
        mixBlendMode: 'difference',
        duration: 0.3 
      });
    };

    const onUnhover = () => {
      gsap.to(cursor, { scale: 1, duration: 0.1 });
      gsap.to(follower, { 
        scale: 1, 
        backgroundColor: "transparent", 
        borderColor: "#00f3ff",
        mixBlendMode: 'normal',
        duration: 0.3 
      });
    };

    const onMouseDown = () => {
      gsap.to(follower, { scale: 0.8, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(follower, { scale: 1, duration: 0.1 });
    };

    // Attach listeners to interactive elements
    const handleLinkHover = () => {
      const links = document.querySelectorAll('a, button, .magnetic-target');
      links.forEach(link => {
        link.addEventListener('mouseenter', onHover);
        link.addEventListener('mouseleave', onUnhover);
        link.addEventListener('mousedown', onMouseDown);
        link.addEventListener('mouseup', onMouseUp);
      });
    };

    // Initial attach
    handleLinkHover();

    // Re-attach on DOM mutations (simple approach)
    const observer = new MutationObserver(handleLinkHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(loop);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-[#00f3ff] rounded-full pointer-events-none z-[10000] hidden md:block"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-[#00f3ff] rounded-full pointer-events-none z-[9999] transition-opacity duration-300 hidden md:block"
      />
    </>
  );
};

export default Cursor;
