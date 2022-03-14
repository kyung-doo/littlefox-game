import { memo, useRef, VFC, useEffect } from 'react';
import { Container, PixiRef, Sprite, _ReactPixi } from '@inlet/react-pixi';
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
   texture: Texture;
   posY: number;
   onAnimationEnd?: (id: string) => void;
}


const ScoreText: VFC<Props> = ({id, texture, onAnimationEnd, posY, ...props}) => {

   const container = useRef<PixiRef<typeof Container>>(null);


   useEffect(() => {
      const y = container.current!.position.y - posY;
      gsap.to(container.current, 0.3, { alpha:1 });
      gsap.to(container.current, 0.5, {delay: 0.3, alpha:0});
      gsap.to(container.current!.position, 1.5, {
         y: y, 
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
         anchor={0.5} 
         skew={[-0.2, 0]}
         alpha={container.current ? container.current.alpha : 0}
         {...props}>
         <Sprite 
            texture={texture}
            anchor={0.5} />
      </Container>
   )
}

export default memo(ScoreText, () => true);