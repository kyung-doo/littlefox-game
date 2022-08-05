import { useEffect, useRef, FC, memo } from 'react';
import { _ReactPixi, Container, PixiRef, Sprite } from '@inlet/react-pixi';
import { gsap, Linear } from 'gsap';
import useAssets from '../../../hooks/useAssets';
import PIXITimeout from '../../../utils/PIXITimeout';


export interface Props extends _ReactPixi.IContainer {
   delay?: number;
   timeout?: number;
}

const StarLight: FC<Props> = ({ delay = 0, timeout = 1000, ...props}) => {

   const { resources } = useAssets();
   const star = useRef<PixiRef<typeof Sprite>>(null);  
   const timer = useRef<any>();

   useEffect(() => {
      const d = delay * 0.001;
      gsap.to(star.current, 0.3, {delay: d, pixi: {scale: 1, rotation: '+=120'}});
      const tl = gsap.timeline({repeat: -1, delay: d + 0.3})
      .to(star.current, 0.5, {pixi: {rotation: '+=120', scale: 0.5, alpha: 0.5}, ease: Linear.easeNone})
      .to(star.current, 0.5, {pixi: {rotation: '+=120', scale: 1, alpha: 1}, ease: Linear.easeNone})
      .to(star.current, 0.5, {pixi: {rotation: '+=120', scale: 0.5, alpha: 0.5}, ease: Linear.easeNone})

      timer.current = PIXITimeout.start(() => {
         tl.clear();
         gsap.to(star.current, 0.3, {pixi: {scale: 0}});
      }, delay + timeout);

   }, []);

   return (
      <Container {...props}>
         <Sprite 
            ref={star}
            anchor={0.5}
            alpha={star.current ? star.current.alpha : 1}
            scale={star.current ? star.current.scale : 0}
            texture={resources.mainStarLight.texture} />
      </Container>
   );
}

export default memo(StarLight, () => true);