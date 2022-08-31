import { useEffect, useRef, FC, memo, useMemo, useCallback } from 'react';
import { _ReactPixi, Container, PixiRef, AnimatedSprite } from '@inlet/react-pixi';
import { AnimatedSprite as PIXIAnimatedSprite } from 'pixi.js';
import useAssets from '../../../hooks/useAssets';
import PIXITimeout from '../../../utils/PIXITimeout';
import { useSelector } from 'react-redux';



const BonusEffect2: FC<_ReactPixi.IContainer> = ( props ) => {

   const { resources } = useAssets();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const container = useRef<PixiRef<typeof Container>>(null); 

   const timer = useRef<any[]>([]);
   

   const fireworkTexture1 = useMemo(() => {
      return Object.keys(resources.spritesheetFireWork1.textures).map( name => resources.spritesheetFireWork1.textures[name]);
   }, []);

   const fireworkTexture2 = useMemo(() => {
      if(!gameData.lowQuality) {
         return Object.keys(resources.spritesheetFireWork2.textures).map( name => resources.spritesheetFireWork2.textures[name]);
      }
   }, []);

   const fireworkTexture3 = useMemo(() => {
      if(!gameData.lowQuality) {
         return Object.keys(resources.spritesheetFireWork3.textures).map( name => resources.spritesheetFireWork3.textures[name]);
      }
   }, []);

   const fireworkTexture4 = useMemo(() => {
      if(!gameData.lowQuality) {
         return Object.keys(resources.spritesheetFireWork4.textures).map( name => resources.spritesheetFireWork4.textures[name]);
      }
   }, []);

   
   
   useEffect(() => {
      const firework1 = container.current!.getChildByName('firework1', true) as PIXIAnimatedSprite;
      const firework2 = container.current!.getChildByName('firework2', true) as PIXIAnimatedSprite;
      const firework3 = container.current!.getChildByName('firework3', true) as PIXIAnimatedSprite;
      const firework4 = container.current!.getChildByName('firework4', true) as PIXIAnimatedSprite;

      timer.current[0] = PIXITimeout.start(() => {
         firework1.visible = true;
         firework1.gotoAndPlay(0);
      }, 300);

      timer.current[1] = PIXITimeout.start(() => {
         firework2.visible = true;
         firework2.gotoAndPlay(0);
      }, 500);

      timer.current[2] = PIXITimeout.start(() => {
         firework3.visible = true;
         firework3.gotoAndPlay(0);
      }, 700);

      timer.current[3] = PIXITimeout.start(() => {
         firework4.visible = true;
         firework4.gotoAndPlay(0);
      }, 900);

      timer.current[4] = PIXITimeout.start(() => {
         firework1.visible = true;
         firework1.gotoAndPlay(0);
      }, 1500);

      timer.current[5] = PIXITimeout.start(() => {
         firework2.visible = true;
         firework2.gotoAndPlay(0);
      }, 1700);

      timer.current[6] = PIXITimeout.start(() => {
         firework3.visible = true;
         firework3.gotoAndPlay(0);
      }, 1900);

      timer.current[7] = PIXITimeout.start(() => {
         firework4.visible = true;
         firework4.gotoAndPlay(0);
      }, 2100);

      return () => {
         timer.current.forEach(t => PIXITimeout.clear(t));
      }

   }, []);

   const onComplete = useCallback(( idx ) => {
      const firework = container.current!.getChildByName(`firework${idx}`, true) as PIXIAnimatedSprite;
      firework.visible = false;
   },[]);

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
            onComplete={()=>onComplete(1)}
            animationSpeed={0.4} />
         
         <AnimatedSprite
            name="firework2"
            position={[750, 0]}
            textures={gameData.lowQuality ? fireworkTexture1 : fireworkTexture2}
            isPlaying={false}
            loop={false}
            anchor={0.5}
            visible={false}
            initialFrame={0}
            onComplete={()=>onComplete(2)}
            animationSpeed={0.4} />
         
         <AnimatedSprite
            name="firework3"
            position={[280, -370]}
            textures={gameData.lowQuality ? fireworkTexture1 : fireworkTexture3}
            isPlaying={false}
            loop={false}
            anchor={0.5}
            visible={false}
            initialFrame={0}
            onComplete={()=>onComplete(3)}
            animationSpeed={0.4} />

         <AnimatedSprite
            name="firework4"
            position={[-800, 25]}
            textures={gameData.lowQuality ? fireworkTexture1 : fireworkTexture4}
            isPlaying={false}
            loop={false}
            anchor={0.5}
            visible={false}
            initialFrame={0}
            onComplete={()=>onComplete(4)}
            animationSpeed={0.4} />
            
      </Container>
   );
}

export default memo(BonusEffect2, () => true);