"use client"
import { scale, useSpring } from 'motion/react';
import React, { useRef ,useEffect,useState} from 'react'
import {motion,Variants} from 'motion/react'
import { init } from 'next/dist/compiled/webpack/webpack';

function MouseFollow() {

    const x = useSpring(0, { stiffness: 100, damping: 20 });
  const y = useSpring(0, { stiffness: 100, damping: 20 });
  const [isClicked,setIsClicked]=useState(false);
  const clickVariant:Variants = {
    initial:{
      scale:1,
    },
    animate:{
      scale: [1, 0.5, 1],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
    }}

  const normal = {
    scale: 1,
  };

    const mouseRef= useRef<HTMLDivElement>(null);
    const handleMouseClick=(e:MouseEvent)=>{
        console.log("clicked ")
        if(mouseRef.current){ 
            setIsClicked(true);
            setTimeout(()=>{
                setIsClicked(false);
            },100)
        }
    }
    const handleMouseMove=(e:MouseEvent)=>{   
x.set(e.clientX);
y.set(e.clientY);
    }

    useEffect(()=>{
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click",handleMouseClick)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click",handleMouseClick)
    };
    },[])
  return (
    <motion.div ref={mouseRef} style ={{ x,y}}  className="w-8 h-8 rounded-full bg-white/40 fixed top-0 left-0 z-10 shadow-md shadow-white/60  blur-sm pointer-events-none"
   animate={isClicked ?"animate":"initial"} variants={clickVariant}
    ></motion.div>
  )
}

export default MouseFollow