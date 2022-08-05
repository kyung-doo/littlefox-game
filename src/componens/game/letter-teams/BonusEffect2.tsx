import { useEffect, useRef, FC, memo, useMemo } from 'react';
import { _ReactPixi, Container, PixiRef, AnimatedSprite } from '@inlet/react-pixi';
import { AnimatedSprite as PIXIAnimatedSprite } from 'pixi.js';
import useAssets from '../../../hooks/useAssets';
import PIXITimeout from '../../../utils/PIXITimeout';



const BonusEffect2: FC<_ReactPixi.IContainer> = ( props ) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null); 

   const timer = useRef<any>();
   

   const fireworkTexture1 = useMemo(() => {
      return Object.keys(resources.spritesheetFireWork1.textures).map( name => resources.spritesheetFireWork1.textures[name]);
   }, []);

   const fireworkTexture2 = useMemo(() => {
      return Object.keys(resources.spritesheetFireWork2.textures).map( name => resources.spritesheetFireWork2.textures[name]);
   }, []);

   const fireworkTexture3 = useMemo(() => {
      return Object.keys(resources.spritesheetFireWork3.textures).map( name => resources.spritesheetFireWork3.textures[name]);
   }, []);

   const fireworkTexture4 = useMemo(() => {
      return Object.keys(resources.spritesheetFireWork4.textures).map( name => resources.spritesheetFireWork4.textures[name]);
   }, []);
   
   useEffect(() => {
      const firework1 = container.current?.getChildByName('firework1', true) as PIXIAnimatedSprite;
      const firework2 = container.current?.getChildByName('firework2', true) as PIXIAnimatedSprite;
      const firework3 = container.current?.getChildByName('firework3', true) as PIXIAnimatedSprite;
      const firework4 = container.current?.getChildByName('firework4', true) as PIXIAnimatedSprite;

      timer.current = PIXITimeout.start(() => {
         firework1.visible = true;
         firework1.gotoAndPlay(0);
      }, 300);

      timer.current = PIXITimeout.start(() => {
         firework2.visible = true;
         firework2.gotoAndPlay(0);
      }, 500);

      timer.current = PIXITimeout.start(() => {
         firework3.visible = true;
         firework3.gotoAndPlay(0);
      }, 700);

      timer.current = PIXITimeout.start(() => {
         firework4.visible = true;
         firework4.gotoAndPlay(0);
      }, 900);

      timer.current = PIXITimeout.start(() => {
         firework1.visible = true;
         firework1.gotoAndPlay(0);
      }, 1500);

      timer.current = PIXITimeout.start(() => {
         firework2.visible = true;
         firework2.gotoAndPlay(0);
      }, 1700);

      timer.current = PIXITimeout.start(() => {
         firework3.visible = true;
         firework3.gotoAndPlay(0);
      }, 1900);

      timer.current = PIXITimeout.start(() => {
         firework4.visible = true;
         firework4.gotoAndPlay(0);
      }, 2100);

      return () => {
         PIXITimeout.clear(timer.current);
      }

   }, []);

   return (
      <Container 
         name="bonusEffect2"
         ref={container}
         {...props}>

         <AnimatedSprite
            name="firework1"
            position={[-280, -460]}
            textures={fireworkTexture1}
            isPlaying={false}
            loop={false}
            anchor={0.5}
            visible={false}
            initialFrame={0}
            animationSpeed={0.4} />
         
         <AnimatedSprite
            name="firework2"
            position={[750, 0]}
            textures={fireworkTexture2}
            isPlaying={false}
            loop={false}
            anchor={0.5}
            visible={false}
            initialFrame={0}
            animationSpeed={0.4} />
         
         <AnimatedSprite
            name="firework3"
            position={[280, -370]}
            textures={fireworkTexture3}
            isPlaying={false}
            loop={false}
            anchor={0.5}
            visible={false}
            initialFrame={0}
            animationSpeed={0.4} />

         <AnimatedSprite
            name="firework4"
            position={[-800, 25]}
            textures={fireworkTexture4}
            isPlaying={false}
            loop={false}
            anchor={0.5}
            visible={false}
            initialFrame={0}
            animationSpeed={0.4} />
            
      </Container>
   );
}

export default memo(BonusEffect2, () => true);