import { useEffect, useRef, VFC, memo } from 'react';
import { _ReactPixi, Container, Sprite, PixiRef } from '@inlet/react-pixi';
import { Sprite as PIXISprite } from 'pixi.js';
import { gsap, Linear } from 'gsap';
import { randomRange } from '../../../utils';
import useAssets from '../../../hooks/useAssets';
import { useSelector } from 'react-redux';



const BonusEffect3: VFC<_ReactPixi.IContainer> = ( props ) => {

   const { resources } = useAssets();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const container = useRef<PixiRef<typeof Container>>(null);
   const particleCon = useRef<PixiRef<typeof Container>>(null);
   const radial = useRef<PixiRef<typeof Sprite>>(null);
   

   useEffect(() => {
      const particleNum = gameData.lowQuality ===0 ? 200 : 50;
      gsap.to(radial.current, 0.6, { delay: 0.1, pixi: {alpha: 0.8}});
      gsap.to(radial.current, 0.6, { delay: 2, pixi: {alpha: 0}});

      let rangeNum = 0;
      Array.from(Array(particleNum), (k, i) => {
         if (gameData.lowQuality ===0) {
            if(rangeNum < 400) {
               rangeNum += 2;
            }
         } else {
            rangeNum = randomRange(300, 400);
         }

         const light = new PIXISprite(resources.mainLight.texture);
         const scale = randomRange(30, 150)*0.01;
         particleCon.current!.addChild(light);
         light.position.x = randomRange(-rangeNum, rangeNum);
         light.position.y = randomRange(-rangeNum*0.8, rangeNum*0.8);
         light.scale.set(scale);
         light.alpha = 0;
         light.anchor.set(0.5);

         const delay = (randomRange(0, 50) * 0.01);
         const speed = randomRange(30, 80) * 0.01;
         gsap.to(light, 0.2, { delay: delay, pixi: { alpha: scale }, ease: Linear.easeNone });
         gsap.to(light, speed, { delay: delay, pixi: { rotation: randomRange(-360, 360), scale: `-=${randomRange(10, 20)*0.01}`}, ease: Linear.easeNone });
         gsap.to(light, 1, { delay: delay + speed-0.1, pixi: { x: `+=${randomRange(-200, 200)}`, y: `+=${randomRange(-200, 200)}`}, ease: Linear.easeNone });
         gsap.to(light, 0.2, { delay: delay + speed + 0.6, pixi: { alpha: 0, }, ease: Linear.easeNone });
      });

   }, []);

   return (
      <Container 
         ref={container} 
         {...props}>
         <Sprite 
            ref={radial}
            position={[1024, 560]}
            texture={resources.mainRadialEffect.texture}
            anchor={0.5}
            scale={[2, 2]}
            alpha={radial.current ? radial.current.alpha : 0} />
         <Container 
            ref={particleCon}
            position={[1024, 560]} />
      </Container>
   );
}

export default memo(BonusEffect3, () => true);