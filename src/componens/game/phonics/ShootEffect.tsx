import { VFC, memo, useRef, useMemo, useEffect } from 'react';
import { AnimatedSprite, Container, PixiRef, Sprite, _ReactPixi } from "@inlet/react-pixi";
import { gsap, Cubic } from 'gsap';
import PIXITimeout from '../../../utils/PIXITimeout';
import useAssets from '../../../hooks/useAssets';



/*
* @ PORPS
*     id: 유니크 아이디
*     type: 이펙트 타입
*     posX: 시작 x 위치
*     onAnimationEnd: 애니메이션 종료 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   id: string;
   type: 'wrong' | 'correct' | 'bonus';
   posX: number;
   onAnimationEnd?: (id: string) => void;
}

const ShootEffect: VFC<Props> = ({id, type, posX, onAnimationEnd, ...props}) => {

   const { resources } = useAssets();
   const explodTextures = resources.commonExplodEffect.textures;

   const container = useRef<PixiRef<typeof Container>>(null);
   const explode = useRef<PixiRef<typeof AnimatedSprite>>(null);
   const circle = useRef<PixiRef<typeof Sprite>>(null);
   const timer = useRef<any[]>([]);

   const getExplodTextures = useMemo(() => {
      return Object.keys(explodTextures).map( name => explodTextures[name]);
   }, []);
   

   useEffect(() => {
      explode.current!.x = posX;
      if(type === 'correct' || type === 'bonus') {
         gsap.set(circle.current, { pixi: {x: posX, alpha: 0, scale: 0, brightness: 2}});
         gsap.to(circle.current, 0.1, { delay: 0.4, pixi: {alpha: 1}});
         gsap.to(circle.current, 0.5, { delay: 0.4, pixi: {scale: 0.8}, ease: Cubic.easeIn });
         gsap.to(circle.current, 0.2, { delay: 0.9, pixi: {alpha: 0, scale: 1} });
         timer.current[0] = PIXITimeout.start(()=> {
            explode.current!.gotoAndPlay(0);
            timer.current[1] = PIXITimeout.start(() => {
               if(onAnimationEnd) onAnimationEnd(id);
            }, 1000);
         }, 800);

      } else {
         explode.current!.gotoAndPlay(0);
         timer.current[2] = PIXITimeout.start(() => {
            if(onAnimationEnd) onAnimationEnd(id);
         }, 1000);
      }

      return () => {
         timer.current.forEach(t => PIXITimeout.clear(t));
      }
   }, []);


   return (
      <Container
         name={id}
         ref={container} 
         anchor={0.5}
         {...props}>

         {(type === 'correct' || type === 'bonus') &&
            <Sprite 
               ref={circle} 
               name="circle" 
               tint={0x6791fd}
               anchor={0.5}
               y={665}
               alpha={circle.current ? circle.current.alpha : 0}
               scale={circle.current ? circle.current.scale : 0}
               texture={resources.mainCircle.texture} />
         }

         <AnimatedSprite
            ref={explode}
            name="explod"
            anchor={0.5}
            y={640}
            zIndex={2}
            loop={false}
            isPlaying={false}
            textures={getExplodTextures}
            scale={0.6}
            animationSpeed={0.8} />

      </Container>
   );
}

export default memo(ShootEffect, () => true);