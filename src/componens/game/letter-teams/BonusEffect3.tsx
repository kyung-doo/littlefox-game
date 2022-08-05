import { useEffect, useRef, FC, memo, useMemo } from 'react';
import { _ReactPixi, Container, PixiRef, AnimatedSprite, Sprite } from '@inlet/react-pixi';
import { AnimatedSprite as PIXIAnimatedSprite, Texture } from 'pixi.js';
import useAssets from '../../../hooks/useAssets';
import PIXITimeout from '../../../utils/PIXITimeout';
import { randomRange, toRadian } from '../../../utils';
import { gsap, Linear } from 'gsap';



interface Props extends _ReactPixi.IContainer {
   delay?: number;
}

const PARTICLE_LEGNTH = 150;
const RNAD_COLOR = [0xffc568, 0x6fff36, 0xb81dcc, 0xfe2882, 0xff7e22, 0x268241, 0x2c5ec8];

const PartyEffect: FC<Props> = ({ delay = 0, ...props }) => {
   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null); 
   const particles = useRef<PixiRef<typeof Sprite>[]>([]); 

   
   useEffect(() => {
      const bg = container.current!.getChildByName('bg');
      gsap.to(bg, 0.2, {pixi: {alpha: 1}});
      gsap.to(bg, 0.2, {delay: 2, pixi: {alpha: 0}});
      particles.current.forEach(particle => {
         const delay = randomRange(10, 50) * 0.01;
         const speed = randomRange(10, 40) * 0.01;
         gsap.to(particle, speed, {
            delay: delay,
            pixi: {x: randomRange(-100, 700), y: `-=${randomRange(400, 1000)}`}, 
            ease: Linear.easeIn 
         });
         gsap.to(particle, randomRange(80, 280) * 0.01, {
            delay: delay + speed,
            pixi: {
               x: `+=${randomRange(-200, 300)}`, 
               y: randomRange(100, 300), 
               rotation: randomRange(-1200, 1200),
               skewX: randomRange(0, 100) * 0.01,
               skewY: randomRange(0, 100) * 0.01,
            },
            ease: Linear.easeNone
         });
      });

   }, []);

   return (
      <Container
         ref={container}
         {...props}>
         <Sprite
            name="bg"
            position={[-313, -459]}
            alpha={0}
            texture={resources.mainPartyBg.texture} />
         
         <Sprite
            name="ribon1"
            position={[0, 0]}
            texture={resources.mainRibon1.texture} />
         <Sprite
            name="ribon2"
            position={[0, 0]}
            texture={resources.mainRibon2.texture} />
         <Sprite
            name="ribon3"
            position={[0, 0]}
            texture={resources.mainRibon3.texture} />
         <Sprite
            name="ribon4"
            position={[0, 0]}
            texture={resources.mainRibon4.texture} />
         <Sprite
            name="ribon5"
            position={[0, 0]}
            texture={resources.mainRibon5.texture} />

         <Container 
            name="particleCon">
            {Array.from(Array(PARTICLE_LEGNTH), (k, i) => (
               <Sprite 
                  key={`particle-${i}`}
                  ref={ref => ref && (particles.current[i] = ref)}
                  width={10}
                  height={10}
                  anchor={0.5}
                  scale={randomRange(80, 120) * 0.01}
                  texture={Texture.WHITE}
                  position={[randomRange(-200, 100), randomRange(100, 300)]}
                  rotation={toRadian(randomRange(-180, 180))}
                  skew={[randomRange(0, 80) * 0.01, randomRange(0, 60) * 0.01]}
                  tint={RNAD_COLOR[randomRange(0, RNAD_COLOR.length-1)]} />
            ))}
         </Container>
         
      </Container>
   );
}



const BonusEffect3: FC<_ReactPixi.IContainer> = ( props ) => {

   const container = useRef<PixiRef<typeof Container>>(null); 

   
   useEffect(() => {
      

   }, []);

   return (
      <Container 
         name="bonusEffect3"
         ref={container}
         {...props}>

         <PartyEffect
            position={[-1000, 398]} />

         <PartyEffect
            position={[1000, 398]}
            scale={[-1, 1]} />
            
      </Container>
   );
}

export default memo(BonusEffect3, () => true);