import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { Container, Graphics, PixiRef, Sprite, Text, useTick, _ReactPixi } from "@inlet/react-pixi";
import { LINE_CAP } from "pixi.js";
import useCounter from "../../../hooks/useCounter";

import { toRadian } from "../../../utils";
import { gsap } from "gsap";
import useAssets from "../../../hooks/useAssets";
import { useSelector } from "react-redux";


/*
* @ PROPS
*     timeLength: 전체 타임
*     onTimeout: 타이머 종료 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   timeLength: number;
   onTimeout: () => void;
}


/*
* @ REFS
*     start: 타이머 시작
*/
export interface Refs {
   start: () => void;
}

const colorToHex = (color: number) => {
   var hexadecimal = color.toString(16);
   return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

const convertRGBtoHex = (red: number, green: number, blue: number) => {
   return parseInt("0x" + colorToHex(red) + colorToHex(green) + colorToHex(blue), 16);
}

const TimeContainer = forwardRef<Refs, Props>(({ timeLength, onTimeout, ...props }, ref ) => {
   
   const { resources } = useAssets();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   
   const timeText = useRef<PixiRef<typeof Text>>(null);
   const isStart = useRef<boolean>(false);
   const gameCounter = useCounter(timeLength);
   const progressBar = useRef<PixiRef<typeof Graphics>>(null);
   const color = useRef<{r:number, g: number, b: number}>({r: 96, g: 255, b: 244});


   const drawArc = useCallback(( angle: number ) => {
      if(gameData.lowQuality === 0) {
         progressBar.current!.cacheAsBitmap = false;
         progressBar.current!.clear();
         progressBar.current!.lineStyle({
            width: 24,
            color: convertRGBtoHex(Math.floor(color.current.r), Math.floor(color.current.g), Math.floor(color.current.b)),
            cap: LINE_CAP.ROUND
         });
         progressBar.current!.arc(0, 0, 115, toRadian(angle), 0)
         progressBar.current!.endFill();
         progressBar.current!.cacheAsBitmap = true;
      }
   },[]);

   useImperativeHandle(ref, () => ({
      start: () => {
         isStart.current = true;
         gameCounter.start();
         const tl = gsap.timeline()
         tl.to(color.current, timeLength * 0.6 * 0.001, { r: 91, g: 255, b: 128 });
         tl.to(color.current, timeLength * 0.2 * 0.001, { r: 250, g: 187, b: 68 });
         tl.to(color.current, timeLength * 0.2 * 0.001, { r: 255, g: 103, b: 121 });
      }
   }));


   useTick(( delta ) => {
      if(isStart.current){
         if( gameCounter.getTime() < timeLength ) {
            if(timeText.current && timeText.current.text !== gameCounter.getFormat()) {
               timeText.current.text = gameCounter.getFormat();
            }
            drawArc(360 * gameCounter.getTime() / timeLength);
         } else {
            isStart.current = false;
            gameCounter.pause();
            onTimeout();
            drawArc(0);
         }
      }
   });

   useEffect(() => drawArc(1), []);

   return (
      <Container name="scoreContainer" {...props}>
         <Text 
            ref={timeText}
            text={gameCounter.getFormat()}
            name="timeText"
            anchor={0.5}
            style={{
               fontSize: 60,
               fontFamily: 'LexendDeca-SemiBold',
               fill: '#ffffff',
               align: 'right',
               dropShadow: true,
               dropShadowColor: '#144032',
               dropShadowBlur: 10,
               dropShadowAngle: Math.PI / 4,
               dropShadowDistance: 10}
            }>      
         </Text>
         {gameData.lowQuality === 0 && 
            <>
               <Sprite 
                  name="progressBg"
                  texture={resources.mainProgressBg.texture}
                  anchor={0.5} />
               <Graphics 
                  ref={progressBar}
                  name="progressBar"
                  scale={[-1, 1]}
                  rotation={toRadian(90)} />
            </>
         }
      </Container>
   );
});

export default memo(TimeContainer, () => true);