import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import { Container, Sprite, PixiRef, _ReactPixi } from "@inlet/react-pixi";
import { gsap, Cubic } from "gsap";
import useAssets from "../../../hooks/useAssets";


/*
* @ REFS
*     show: 과녁 가이드 보임
*     hide: 과녁 가이드 숨김
*     moveTo: 과녁 가이드 이동
*/
export interface Refs {
   show: () => void;
   hide: () => void;
   moveTo: ( posX: number, hit: boolean ) => void;
}

const AimPoint = forwardRef<Refs, _ReactPixi.IContainer>((props, ref) => {

   const { resources } = useAssets();

   const container = useRef<PixiRef<typeof Container>>(null);
   const circle = useRef<PixiRef<typeof Sprite>>(null);

  
   useImperativeHandle(ref, ()=>({
      show: () => {
         circle.current!.scale.set(0);
         container.current!.visible = true;
      },

      hide: () => {
         container.current!.visible = false;
      },

      moveTo: ( posX, hit ) => {
         container.current!.position.x = posX;
         if(hit) {
            gsap.to(circle.current, 0.3, { pixi: { scale: 1 }, ease: Cubic.easeOut});
         } else {
            gsap.to(circle.current, 0.3, { pixi: { scale: 0.3 }, ease: Cubic.easeOut});
         }
      }
   }));

   return (
      <Container 
         ref={container}
         name="aimPoint"
         anchor={0.5}
         alpha={0.3}
         visible={container.current ? container.current.visible : false}
         {...props}>
         <Sprite
            ref={circle}
            name="circle"
            scale={ circle.current ? circle.current.scale : 0 }
            anchor={0.5}
            texture={resources.mainAim.texture} />
      </Container>
   )
});

export default memo(AimPoint, () => true);