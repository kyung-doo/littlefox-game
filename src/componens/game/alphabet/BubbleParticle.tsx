import { forwardRef, memo, useCallback, useImperativeHandle, useRef } from "react";
import { Container, PixiRef, _ReactPixi } from "@inlet/react-pixi";
import { Sprite as PIXISprite } from 'pixi.js';
import { gsap, Power3 } from 'gsap';
import { quadBezier, randomRange } from "../../../utils";
import useAssets from "../../../hooks/useAssets";

/*
* @ REFS
*     start: 애니메이션 시작
*/
export interface Refs {
   start: () => void;
}

const BUBBLE_NUM = 40;


const BubbleParticle = forwardRef<Refs, _ReactPixi.IContainer>((props, ref) => {

   const { resources } = useAssets();
   const bubbleTextures = resources.spritesheetBubbleDefault.textures;
   const bubbleCon = useRef<PixiRef<typeof Container>>(null);


   const start = useCallback(() => {
      const texture = bubbleTextures[Object.keys(bubbleTextures)[0]];
      for(let i=0; i<BUBBLE_NUM; i++) {
         const bubble = new PIXISprite(texture);
         bubbleCon.current!.addChild(bubble);
         bubble.position.x = 280;
         bubble.position.y = 595;
         bubble.scale.set(0.1);
         bubble.alpha = 0;
         bubble.visible = true;

         const prop = { 
            value: 0, 
            speed: randomRange(300, 600) * 0.01, 
            alpha: randomRange(30, 70) * 0.01, 
            scale: randomRange(30, 70) * 0.01 ,
            randX: randomRange(400, 1500),
            randX2: randomRange(600, 2500),
            randY: randomRange(1000, 1500),
            randY2: -randomRange(500, 800),
         };

         gsap.to(prop, prop.speed, { delay: i * 0.015,  ease: Power3.easeOut, value: 1,
            onStart: () => {
               bubble.alpha = 0.2;
            }, 
            onUpdate: () => {
               const x = quadBezier(280, prop.randX, prop.randX2, prop.value);
               const y = quadBezier(595, prop.randY, prop.randY2, prop.value);
               try{
                  bubble.alpha = prop.alpha;
                  bubble.position.x = x;
                  bubble.position.y = y;
                  bubble.scale.set(prop.scale * prop.value + 0.1);
               } catch(e) {}
            },
            onComplete: ()=>{
               bubble.destroy();
            }
         });
      }
   }, []);

   useImperativeHandle(ref, () => ({
      start: start
   }));

   return <Container ref={bubbleCon} name="bubbleParicle" {...props} />

})

export default memo(BubbleParticle, () => true);