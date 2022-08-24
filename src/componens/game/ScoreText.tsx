import { memo, useRef, VFC, useEffect } from 'react';
import { Container, PixiRef, Sprite, _ReactPixi, Text } from '@inlet/react-pixi';
import { gsap, Power2 } from 'gsap';
import { Texture } from 'pixi.js';


/*
* @ PROPS
*     id: 유니크 아이디
*     texture: 스코어 텍스쳐
*     posY: 애니메이션 y 값
*     onAnimationEnd: 애니메이션 종료 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   id: string;
   texture?: Texture;
   posY?: number;
   scale?: number;
   delay?: number;
   score?: number;
   onAnimationEnd?: (id: string) => void;
}


const ScoreText: VFC<Props> = ({ id, texture, score, onAnimationEnd, posY=0, scale=1, delay=0.3, ...props }) => {

   const container = useRef<PixiRef<typeof Container>>(null);


   useEffect(() => {
      const y = container.current!.position.y - posY;
      gsap.to(container.current, 0.3, { alpha:1 });
      gsap.to(container.current, 0.5, {delay: delay, alpha:0});
      gsap.to(container.current, 1.5, {
         pixi: {y: y, scale: scale},
         ease: Power2.easeOut, 
         onComplete:() => {
            if(onAnimationEnd) onAnimationEnd(id);
         }
      });
   },[]);

   return (
      <Container 
         name={id}
         ref={container} 
         alpha={container.current ? container.current.alpha : 0}
         {...props}>
         {texture && 
            <Sprite 
               texture={texture}
               anchor={0.5} />
         }
         {score && 
            <>
               <Text 
                  text={score > 0 ? `+${score}` : `-${Math.abs(score)}`}
                  anchor={0.5}
                  position={[0, 0]}
                  skew={[-0.2, 0]}
                  style={{
                     fontSize: 61,
                     fontFamily: 'Maplestory Bold',
                     fontWeight: '600',
                     fill: '#21edff',
                     align: 'center',
                     lineJoin: "round",
                     stroke: "#21edff",
                     letterSpacing: 5,
                     strokeThickness: 35}} />

               <Text 
                  text={score > 0 ? `+${score}` : `-${Math.abs(score)}`}
                  anchor={0.5}
                  position={[0, 0]}
                  skew={[-0.2, 0]}
                  style={{
                     fontSize: 61,
                     fontFamily: 'Maplestory Bold',
                     fontWeight: '600',
                     fill: `${score > 0 ? '#ff4958' : '#1088ef'}`,
                     align: 'center',
                     lineJoin: "round",
                     stroke: "#ffffff",
                     letterSpacing: 5,
                     strokeThickness: 15}} />
            </>
         }
      </Container>
   )
}

export default memo(ScoreText, () => true);