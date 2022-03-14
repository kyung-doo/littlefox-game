import { useEffect, useRef, VFC, memo } from 'react';
import { _ReactPixi, Container, Sprite, PixiRef } from '@inlet/react-pixi';
import { gsap, Power2 } from 'gsap';
import useAssets from '../../../hooks/useAssets';



const BonusEffect2: VFC<_ReactPixi.IContainer> = ( props ) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const rainbow = useRef<PixiRef<typeof Sprite>>(null);
   const mask = useRef<PixiRef<typeof Sprite>>(null);

   useEffect(() => {
      rainbow.current!.mask = mask.current;
      gsap.to(mask.current, 1.2, { delay: 0.3,  pixi: { scale: 5, x: 800 }, ease: Power2.easeInOut, 
         onStart: () =>{
            container.current!.visible = true;
         }
      });
      gsap.to(mask.current, 1.2, { delay: 1.5,  pixi: { x: 2500, y: 1500 }, ease: Power2.easeInOut });
   }, []);

   return (
      <Container 
         ref={container} 
         visible={container.current ? container.current.visible : false }
         {...props}>
         <Sprite 
            ref={mask} 
            y={mask.current ? mask.current.position.y : 350}
            scale={mask.current ? mask.current.scale : 0}
            anchor={0.5}
            texture={resources.mainRainbowMask.texture} />
         <Sprite 
            ref={rainbow} 
            texture={resources.mainRainbow.texture} />
      </Container>
   );
}

export default memo(BonusEffect2, () => true);