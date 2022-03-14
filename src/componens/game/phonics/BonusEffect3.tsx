import { useEffect, useRef, VFC, memo } from 'react';
import { _ReactPixi, Container, Sprite, PixiRef } from '@inlet/react-pixi';
import { BLEND_MODES, Container as PIXIContainer, Sprite as PIXISprite } from 'pixi.js';
import { gsap, Cubic, Expo } from 'gsap';
import { randomRange, toRadian } from '../../../utils';
import PIXITimeout from '../../../utils/PIXITimeout';
import useAssets from '../../../hooks/useAssets';
import { useSelector } from 'react-redux';



const BonusEffect3: VFC<_ReactPixi.IContainer> = ( props ) => {

   const { resources } = useAssets();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const container = useRef<PixiRef<typeof Container>>(null);
   const spark = useRef<PixiRef<typeof Sprite>>(null);
   const circles = useRef<PixiRef<typeof Sprite>[]>([]);
   const particleCon = useRef<PixiRef<typeof Container>>(null);
   const timer = useRef<any>(null);
   
   

   useEffect(() => {
      timer.current = PIXITimeout.start(() => {
         gsap.to(spark.current, 2, {pixi: { scale: 1 }, ease: Expo.easeInOut});
         gsap.to(spark.current, 1, {pixi: {alpha: 1 }});
         gsap.to(spark.current, 0.5, {delay: 1.3, pixi: {alpha: 0 }});
         circles.current.forEach((circle, i) => {
            gsap.from(circle, 1.5, {delay: 0.2 + i * 0.2, pixi: { scale: `-=0.6` }});
            gsap.to(circle, 0.5, {delay: 0.2 +  i * 0.2, pixi: {alpha: 1 }});
            gsap.to(circle, 0.5, {delay: 1.5, pixi: {alpha: 0 }});
         });
         if(gameData.lowQuality === 0) {
            Array.from(Array(40), (k, i) => {
               const particleSet = new PIXIContainer();
               const particle = new PIXISprite(resources.mainOne.texture);
               particle.position.y = -randomRange(10, 150);
               particle.blendMode = BLEND_MODES.ADD;
               particle.scale.set(0);
               particle.alpha = 0;
               particleSet.addChild(particle);
               particleSet.rotation = toRadian(randomRange(-360, 360));
               particleCon.current!.addChild(particleSet);
               const delay = (i%4) * 0.1 + 0.3;
               gsap.to(particle, 1.5, { delay: delay, pixi: {y: -randomRange(200, 400)}, ease: Cubic.easeInOut});
               gsap.to(particle, 0.5, { delay: delay, pixi: {alpha: randomRange(50, 100) * 0.01, scale: randomRange(10, 40) * 0.01}});
               gsap.to(particle, 0.5, { delay: delay + 1, pixi: {alpha: 0}, onComplete: () => {
                  particle.destroy();
                  particleSet.destroy();
               }});
            });
         }
      }, 2500);
      return () => {
         PIXITimeout.clear(timer.current);
      }
   }, []);


   return (
      <Container 
         name="bonusEffect3"
         ref={container} 
         {...props}>

         <Sprite 
            ref={spark}
            name="spark"
            anchor={0.5}
            alpha={spark.current ? spark.current.alpha : 0}
            scale={spark.current ? spark.current.scale : 0}
            texture={resources.mainBonusSpark.texture} />

         <Sprite 
            ref={ref => ref && (circles.current[0] = ref)}
            name="circle1"
            anchor={0.5}
            alpha={circles.current[0] ? circles.current[0].alpha : 0}
            scale={circles.current[0] ? circles.current[0].scale : 0.6}
            texture={resources.mainBonusCircle.texture} />
         <Sprite 
            ref={ref => ref && (circles.current[1] = ref)}
            name="circle2"
            anchor={0.5}
            rotation={circles.current[1] ? circles.current[1].rotation : Math.PI/2}
            alpha={circles.current[1] ? circles.current[1].alpha : 0}
            scale={circles.current[1] ? circles.current[1].scale : 0.9}
            texture={resources.mainBonusCircle.texture} />
         <Sprite 
            ref={ref => ref && (circles.current[2] = ref)}
            name="circle3"
            anchor={0.5}
            rotation={circles.current[2] ? circles.current[2].rotation : Math.PI}
            alpha={circles.current[2] ? circles.current[2].alpha : 0}
            scale={circles.current[2] ? circles.current[2].scale : 1.2}
            texture={resources.mainBonusCircle.texture} />

         <Container 
            ref={particleCon} 
            name="particleCon" />

      </Container>
   );
}

export default memo(BonusEffect3, () => true);