import { FC, useMemo, useCallback, useEffect, useRef, memo } from "react";
import { AnimatedSprite, Container, PixiRef, Sprite, _ReactPixi } from "@inlet/react-pixi";
import { gsap } from "gsap";
import PIXITimeout from "../../../utils/PIXITimeout";
import useAssets from "../../../hooks/useAssets";
import { useSelector } from "react-redux";



const BonusContainer: FC<_ReactPixi.IContainer> = ( props ) => {

   const bonusCount: any = useSelector<any>(state => state.root.bonusCount);
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const bonus = useRef<PixiRef<typeof AnimatedSprite>[]>([]);
   const bonusEffect= useRef<PixiRef<typeof Sprite>>(null);
   const timer = useRef<any[]>([]);
   

   const getBonusTextures1 = useMemo(() => {
      return Object.keys(resources.spritesheetBalloonLight1.textures).map( name => resources.spritesheetBalloonLight1.textures[name]);
   }, []);

   const getBonusTextures2 = useMemo(() => {
      return Object.keys(resources.spritesheetBalloonLight2.textures).map( name => resources.spritesheetBalloonLight2.textures[name]);
   }, []);

   const onAnimationComplete = useCallback(( idx ) => {
      timer.current[idx] = PIXITimeout.start(()=> {
         bonus.current[idx].gotoAndPlay(1);
      }, 1000);
   }, []);

   useEffect(()=> {
      if(gameData.lowQuality === 0){
         gsap.killTweensOf(bonusEffect.current);
         bonusEffect.current!.alpha = 1
         bonus.current.forEach(b => b.gotoAndStop(0));
         timer.current.forEach(t => PIXITimeout.clear(t));
         switch(bonusCount) {
            case 1 : 
               bonus.current[0].gotoAndPlay(1);
            break;
            case 2 : 
               bonus.current[0].gotoAndPlay(1);
               timer.current[1] = PIXITimeout.start(()=> {
                  bonus.current[1].gotoAndPlay(1);
               }, 150);
            break;
            case 3 : 
               bonus.current[0].gotoAndPlay(1);
               timer.current[1] = PIXITimeout.start(()=> {
                  bonus.current[1].gotoAndPlay(1);
               }, 150);
               timer.current[2] = PIXITimeout.start(()=> {
                  bonus.current[2].gotoAndPlay(1);
               }, 300);
               gsap.set(bonusEffect.current, {pixi: {alpha: 0.5}, yoyo: true, repeat: -1,  repeatDelay: 0.4});
            break;
         }
      }
   }, [bonusCount]);


   return (
      <Container 
         ref={container} 
         name="bonusContainer" 
         position={[1510, 35]}
         {...props}>
         <Sprite texture={resources.mainBonusBg.texture} />
         {gameData.lowQuality === 0
            ?
            <>
               <AnimatedSprite
                  ref={ref => ref && (bonus.current[0] = ref)}
                  name="bonus1"
                  isPlaying={bonus.current[0] ? bonus.current[0].playing : false }
                  loop={false}
                  animationSpeed={0.4}
                  onComplete={() => onAnimationComplete(0)}
                  visible={bonusCount > 0}
                  position={[0, 12]}
                  textures={getBonusTextures1} />
               <AnimatedSprite 
                  ref={ref => ref && (bonus.current[1] = ref)}
                  name="bonus2"
                  isPlaying={bonus.current[1] ? bonus.current[1].playing : false }
                  loop={false}
                  animationSpeed={0.4}
                  onComplete={() => onAnimationComplete(1)}
                  visible={bonusCount > 1}
                  position={[160, 12]}
                  textures={getBonusTextures1} />
               <AnimatedSprite 
                  ref={ref => ref && (bonus.current[2] = ref)}
                  name="bonus3"
                  isPlaying={bonus.current[2] ? bonus.current[2].playing : false }
                  loop={false}
                  animationSpeed={0.4}
                  onComplete={() => onAnimationComplete(2)}
                  visible={bonusCount > 2}
                  position={[337, -1]}
                  textures={getBonusTextures2} />
            </>
            :
            <>
               <Sprite
                  name="bonus1"
                  visible={bonusCount > 0}
                  position={[0, 12]}
                  texture={getBonusTextures1[0]} />
               <Sprite 
                  name="bonus2"
                  visible={bonusCount > 1}
                  position={[160, 12]}
                  texture={getBonusTextures1[0]} />
               <Sprite 
                  name="bonus3"
                  visible={bonusCount > 2}
                  position={[337, -1]}
                  texture={getBonusTextures2[0]} />
            </>
         }
         <Sprite 
            ref={bonusEffect}
            name="bonusEffect"
            visible={bonusCount > 2}
            position={[331, 41]}
            texture={resources.mainBonusOn.texture} />
      </Container>
   );
}

export default memo(BonusContainer, () => true);