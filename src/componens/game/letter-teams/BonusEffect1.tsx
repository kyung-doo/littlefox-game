import { useEffect, useRef, FC, memo } from 'react';
import { _ReactPixi, Container, PixiRef, Sprite } from '@inlet/react-pixi';
import { randomRange, toRadian } from '../../../utils';
import { gsap, Linear, Power3 } from 'gsap';
import useAssets from '../../../hooks/useAssets';
import StarLight from './StarLight';
import PIXITimeout from '../../../utils/PIXITimeout';
import { useSelector } from 'react-redux';



const STAR_ROTATIONS = [-10,-36,61,-60,-115,36,70,-49,-10,117];
const WHITE_ROTATIONS = [10, 55, 100, 145, -10, -55, -100, -145];


const WhiteStar: FC<_ReactPixi.IContainer> = (props) => {
   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const timer = useRef<any>();
   

   useEffect(() => {
      const line = container.current!.getChildByName('line', true);
      timer.current = PIXITimeout.start(() => {
         gsap.to(container.current, 0.2, {pixi: {alpha: 1}});
         gsap.to(container.current, 1.5, {pixi: {y: -1000}, ease: Power3.easeOut});
         gsap.to(line, 0.5, {pixi: {scaleY: 1}, ease: Power3.easeOut});
         gsap.to(line, 0.5, {delay: 0.5, pixi: {scaleY: 0}, ease: Power3.easeIn});
         gsap.to(container.current, 0.2, {delay: 0.8, pixi: {alpha: 0}});
      }, randomRange(100, 0) + 300);

      return () => {
         PIXITimeout.clear(timer.current);
      }
   },[]);

   return(
      <Container
         {...props}>
         <Container
            ref={container}
            alpha={0}>
            <Sprite 
               name="star"
               anchor={0.5}
               texture={resources.mainWhiteStar.texture} />
            <Sprite 
               name="line"
               anchor={[0.5, 0.1]}
               scale={[1, 0]}
               texture={resources.mainWhiteLine.texture} />
         </Container>
      </Container>
   );
};



const BonusEffect1: FC<_ReactPixi.IContainer> = ( props ) => {

   const { resources } = useAssets();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const container = useRef<PixiRef<typeof Container>>(null);  
   const smallStars = useRef<PixiRef<typeof Container>[]>([]);  

   useEffect(() => {
      const bg = container.current!.getChildByName('bg', true);
      const light = container.current!.getChildByName('light', true);
      const bigStar = container.current!.getChildByName('bigStar', true);

      gsap.to(bg, 0.5, {pixi: {alpha: 1}});
      gsap.to(light, 0.5, {pixi: {alpha: 1}});
      gsap.to(light, 3, {pixi: {rotation: 360}, repeat: -1, ease: Linear.easeNone});

      gsap.to(bg, 0.5, {delay: 2.3, pixi: {alpha: 0}});
      gsap.to(light, 0.5, {delay: 2.3, pixi: {alpha: 0}, onComplete: () => {
         gsap.killTweensOf(light);
      }});

      gsap.timeline()
      .to(bigStar, 0.3, {pixi: {alpha: 1}})
      .to(bigStar, 1, {pixi: {rotation: 360, scale: 1}}, '-=0.3')
      .to(bigStar, 0.2, {pixi: {scaleX: 0}})
      .to(bigStar, 0.2, {pixi: {scaleX: 1}})
      .to(bigStar, 0.2, {pixi: {scaleX: 0}})
      .to(bigStar, 0.2, {pixi: {scaleX: 1}})
      .to(bigStar, 0.6, {delay:0.2, pixi: {alpha: 0, scale: 2}});

      if(!gameData.lowQuality) {

         smallStars.current.forEach((star, i) => {
            const delay = 0.1 * i + 0.2;
            gsap.to(star.children, 0.2, {delay: delay, pixi: {alpha: 1}});
            gsap.to(star.children, 1, {delay: delay, pixi: {y: -randomRange(300, 400)}, ease: Linear.easeOut});
            gsap.to(star.children, 0.2, {delay: delay+1, pixi: {alpha: 0, scale: 0.2}});
         });
      }

   }, []);

   return (
      <Container 
         name="bonusEffect1"
         ref={container} 
         {...props}>
         <Sprite 
            name="bg"
            anchor={0.5}
            y={170}
            alpha={0}
            texture={resources.mainBonus1Bg.texture} />
         <Sprite 
            name="light"
            anchor={0.5}
            y={170}
            alpha={0}
            texture={resources.mainBonus1Light.texture} />
         
         {!gameData.lowQuality &&
            <>
               {Array.from(WHITE_ROTATIONS, (r, i) => (
                  <WhiteStar
                     key={`white-star-${i}`}
                     rotation={toRadian(r)}
                     scale={randomRange(30, 50) * 0.01}
                     position={[0, 170]} />
               ))}

               {Array.from(STAR_ROTATIONS, (r, i) => (
                  <Container
                     ref={ref => ref && (smallStars.current[i] = ref)}
                     key={`small-star-${i}`}
                     rotation={toRadian(r)}
                     position={[0, 117]}>
                     <Sprite 
                        anchor={0.5}
                        alpha={0}
                        scale={randomRange(10, 35) * 0.01}
                        texture={resources.mainBonus1Star.texture} />
                  </Container>
               ))}
            </>
         }
               
         <Sprite
            name="bigStar"
            alpha={0}
            scale={0}
            anchor={0.5}
            y={170}
            texture={resources.mainBonus1Star.texture} />
            
         {!gameData.lowQuality &&
            <>
               <StarLight
                  name="starLight1"
                  timeout={1300}
                  delay={500}
                  position={[0, 117]} />
               <StarLight
                  name="starLight2"
                  timeout={1300}
                  delay={600}
                  scale={[-1, 1]}
                  position={[-35, 265]} />
               <StarLight
                  name="starLight3"
                  timeout={1300}
                  delay={500}
                  scale={[0.7]}
                  position={[-178, 165]} />
               <StarLight
                  name="starLight4"
                  timeout={1300}
                  delay={600}
                  scale={[-0.7, 0.7]}
                  position={[148, 250]} />
            </>
         }

      </Container>
   );
}

export default memo(BonusEffect1, () => true);