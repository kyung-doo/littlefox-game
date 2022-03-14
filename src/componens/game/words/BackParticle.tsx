import { FC, memo, useCallback, useEffect, useRef } from "react";
import { Container, PixiRef, _ReactPixi } from "@inlet/react-pixi";
import { BLEND_MODES, Sprite as PIXISprite, Container as PIXIContainer } from 'pixi.js';
import { randomRange, toRadian } from "../../../utils";
import { gsap, Linear } from 'gsap';
import PIXITimeout from "../../../utils/PIXITimeout";
import useAssets from "../../../hooks/useAssets";




const PARTICLE_LENGTH = 40;


const BackParticle: FC<_ReactPixi.IContainer> = () => {
   
   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);

   

   const moveParticle = useCallback((particleCon, particle) => {
      particleCon.position.x = randomRange(-300, 2300);
      particleCon.position.y = 1024 + randomRange(500, 800);
      particleCon.alpha = randomRange(10, 30) * 0.01;
      particleCon.scale.set(randomRange(30, 150) * 0.01);
      particle.scale.x = Math.floor(Math.random() * 2) === 0 ? 1 : -1;
      particle.rotation = toRadian(randomRange(-360, 360));
      gsap.to(particleCon, (10 * (1.5 - particleCon.scale.x))+5, {
         pixi: {y: -randomRange(100, 500), rotation: `+=${randomRange(-360, 360)}`}, 
         ease: Linear.easeNone, 
         onComplete: ()=> moveParticle(particleCon, particle)
      });
   },[]);


   useEffect(() => {
      const timer: any[] =[];
      Array.from(Array(PARTICLE_LENGTH), (k, i) => {
         const particleCon = new PIXIContainer();
         const particle = new PIXISprite(resources[`mainBackParticle${randomRange(1, 5)}`].texture);
         particleCon.addChild(particle);
         particle.anchor.set(0.5);
         particleCon.alpha =0;
         particle.blendMode = BLEND_MODES.ADD;
         container.current?.addChild(particleCon);
         timer[i] = PIXITimeout.start(() => {
            moveParticle(particleCon, particle);
         }, randomRange(0, 10000));
      });

      return () => {
         timer.forEach(t => PIXITimeout.clear(t));
      }
   }, []);
   

   return (
      <Container name="backParticleCon" ref={container} />
   )

}
export default memo(BackParticle, () => true);