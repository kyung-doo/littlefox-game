import { useEffect, useRef, FC, memo } from 'react';
import { _ReactPixi, Container, PixiRef } from '@inlet/react-pixi';
import { Container as PIXIContainer, Sprite as PIXISprite } from 'pixi.js';
import { randomRange } from '../../../utils';
import { gsap } from 'gsap';
import useAssets from '../../../hooks/useAssets';



const BonusEffect1: FC<_ReactPixi.IContainer> = ( props ) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);   

   useEffect(() => {

      Array.from(Array(30), (k, i) => {
         const starCon = new PIXIContainer();
         const star = new PIXISprite(resources.mainStar.texture);
         container.current!.addChild(starCon);
         star.position.y = -150;
         star.alpha = 0;
         star.anchor.set(0.5);
         star.scale.set(0);
         starCon.rotation = randomRange(0, 360);
         starCon.addChild(star);
         
         const speed= randomRange(40, 60)*0.01;
         const delay = randomRange(0, 80)*0.01;
         gsap.to(star, speed, { delay:  delay, pixi: {scale: randomRange(30, 120) * 0.01, y: -randomRange(180, 170), rotation: `+=${randomRange(-45, 45)}`}});
         gsap.to(star, speed/2, { delay:  delay, pixi: {alpha: 1}});
         gsap.to(star, 0.5, { delay:  delay+speed, pixi: {alpha: 0,  scale: 0.2, y: `-=${randomRange(10, 60)}`, rotation: `+=${randomRange(-45, 45)}`}});
      });
   }, []);

   return (
      <Container ref={container} {...props} />
   );
}

export default memo(BonusEffect1, () => true);