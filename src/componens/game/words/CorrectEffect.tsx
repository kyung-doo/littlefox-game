import { useEffect, useRef, VFC, memo } from 'react';
import { Container, PixiRef, _ReactPixi } from "@inlet/react-pixi";
import { Container as PIXIContainer, Sprite as PIXISprite } from 'pixi.js';
import { gsap, Linear, Back } from 'gsap';
import { randomRange, toRadian } from '../../../utils';
import PIXITimeout from '../../../utils/PIXITimeout';
import useAssets from '../../../hooks/useAssets';

/*
* @ PROPS
*     id: 유니크 아이디
*     onAnimationFinish: 애니메이션 종료 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   id: string;
   onAnimationFinish: (id: string) => void;
}

const CorrectEffect: VFC<Props> = ( {id, onAnimationFinish, ...props}) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const timer = useRef<any>(null);

   useEffect(() => {
      Array.from(Array(3), (k, i) => {
         const circle = new PIXISprite(resources[`mainEffectCircle${i+1}`].texture);
         circle.anchor.set(0.5);
         circle.scale.set(0.3);
         circle.alpha = 0;
         gsap.to(circle, 0.2, {delay: 0.1 * (3-i), pixi: {alpha: 1}, ease: Linear.easeNone});
         gsap.to(circle, 0.3, {delay: 0.1 * (3-i), pixi: {scale: 1}, ease: Linear.easeNone});
         gsap.to(circle, 0.3, {delay: 0.1 * (3-i) + 0.3, pixi: {scale: 1.2}, ease: Linear.easeOut});
         gsap.to(circle, 0.2, {delay: 0.1 * (3-i) + 0.4, pixi: {alpha: 0}, ease: Linear.easeOut});
         container.current!.addChild(circle);
      });
      let angle = -45;
      Array.from(Array(7), (k, i) => {
         const star = new PIXISprite(resources.mainEffectStar.texture);
         star.anchor.set(0.5);
         star.scale.set(randomRange(30, 100)*0.01);
         star.alpha = 0;
         star.position.y = -randomRange(0, 50);
         const starCon = new PIXIContainer();
         starCon.position.y = 50;
         starCon.addChild(star);
         angle+=10;
         starCon.rotation = toRadian(angle);
         const speed = randomRange(100, 150) * 0.01;
         gsap.to(star, 0.2, {pixi: {alpha: 1}});
         gsap.to(star, speed, {pixi: {y: -randomRange(200, 350)}, ease: Linear.easeOut});
         gsap.to(star, 0.2, {delay: speed-0.2, pixi: {alpha: 0}});
         container.current!.addChild(starCon);
      });

      timer.current = PIXITimeout.start(()=>{
         onAnimationFinish(id);
      }, 2000);

      return () => {
         PIXITimeout.clear(timer.current);
      }
   }, []);

   return (
      <Container ref={container} name="correctEffectCon" {...props} />
   );
}

export default memo(CorrectEffect, () => true);