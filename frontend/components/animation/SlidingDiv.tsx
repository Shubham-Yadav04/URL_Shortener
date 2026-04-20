"use client"
import React, { useRef, useState } from 'react'
import {color, motion,Variants} from 'motion/react'

function SlidingDiv({children,bgColorInitial,bgColorFinal,initialColor,finalColor}:{children:React.ReactNode,bgColorInitial:string,bgColorFinal:string,initialColor:string,finalColor:string}) {
    const divRef= useRef<HTMLDivElement>(null);
    const slideVariant:Variants={
        initial:{
            backgroundColor:"bgColorInitial",
            width:'0%',
        },
        animate:{
            backgroundColor:bgColorFinal,
            width:"100%",
            transition:{
                duration:0.7,
                ease:"linear",
            }
        }
    }

  return (<>
    <motion.div
      initial="initial"
      whileHover="animate"
      className="relative inline-block overflow-hidden rounded-xl"
        style={{
          backgroundColor:bgColorInitial,
        }}
    >
        <motion.div
        variants={slideVariant}
      
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 w-fit h-fit ">
        {children}
      </div>
    </motion.div>
    </>
  )
}

export default SlidingDiv