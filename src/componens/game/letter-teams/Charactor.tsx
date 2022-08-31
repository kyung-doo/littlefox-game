import { forwardRef, useMemo, useRef, useCallback, useImperativeHandle, memo } from "react";
import { _ReactPixi, Container, AnimatedSprite, PixiRef } from "@inlet/react-pixi";
import useAssets from "../../../hooks/useAssets";
import PIXITimeout from "../../../utils/PIXITimeout";
import { useSelector } from "react-redux";


export interface Refs {
   default: () => void;
   correct: () => void;
   wrong: () => void;
   bonus: () => void;
}

const Charactor = forwardRef<Refs, _ReactPixi.IContainer>((props, ref) => {

   const { resources } = useAssets();
   const gameData: any = useSelector<any>(state => state.root.gameData);
   const charators = useRef<{[key: string]: PixiRef<typeof AnimatedSprite>}>({});
   const timer = useRef<any>(null);

   const defaultCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorDefault.textures).map( name => resources.spritesheetCharactorDefault.textures[name]);
   }, []);

   const correctCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorCorrect.textures).map( name => resources.spritesheetCharactorCorrect.textures[name]);
   }, []);

   const wrongCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorWrong.textures).map( name => resources.spritesheetCharactorWrong.textures[name]);
   }, []);

   const bonusCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorBonus.textures).map( name => resources.spritesheetCharactorBonus.textures[name]);
   }, []);


   const onAnimationComp = useCallback(() => {
      timer.current = PIXITimeout.start(() => charators.current.default.gotoAndPlay(0), gameData.lowQuality ? 0 : 100);
   },[]);

   const onAnimationComp2 = useCallback(() => {
      timer.current = PIXITimeout.start(() => charators.current.bonus.gotoAndPlay(0), gameData.lowQuality ? 0 : 100);
   },[]);

   const showDefault = useCallback(() => {
      charators.current.default.visible = true;
      charators.current.default.gotoAndPlay(0);
      charators.current.correct.visible = false;
      charators.current.correct.stop();
      charators.current.wrong.visible = false;
      charators.current.wrong.stop();
      charators.current.bonus.visible = false;
      charators.current.bonus.stop();
   },[]); 

   const showCorrect = useCallback(() => {
      charators.current.default.visible = false;
      charators.current.default.stop();
      charators.current.correct.visible = true;
      charators.current.correct.gotoAndPlay(0);
      charators.current.wrong.visible = false;
      charators.current.wrong.stop();
      charators.current.bonus.visible = false;
      charators.current.bonus.stop();
   },[]); 

   const showWrong = useCallback(() => {
      charators.current.default.visible = false;
      charators.current.default.stop();
      charators.current.correct.visible = false;
      charators.current.correct.stop();
      charators.current.wrong.visible = true;
      charators.current.wrong.gotoAndPlay(0);
      charators.current.bonus.visible = false;
      charators.current.bonus.stop();
   },[]); 

   const showBonus = useCallback(() => {
      charators.current.default.visible = false;
      charators.current.default.stop();
      charators.current.correct.visible = false;
      charators.current.correct.stop();
      charators.current.wrong.visible = false;
      charators.current.wrong.stop();
      charators.current.bonus.visible = true;
      charators.current.bonus.gotoAndPlay(0);
   },[]); 


   useImperativeHandle(ref, () => ({
      default: () => showDefault(),
      correct: () => showCorrect(),
      wrong: () => showWrong(),
      bonus: () => showBonus()
   }));

   return (
      <Container {...props}>

         <AnimatedSprite
            ref={ref => ref && (charators.current.default = ref)}
            name="charactorDefault"
            position={[-155, -580]}
            textures={defaultCharactorTextures}
            isPlaying={false}
            loop={false}
            onComplete={onAnimationComp}
            initialFrame={0}
            animationSpeed={gameData.lowQuality ? 0.2 : 0.3} />

         <AnimatedSprite
            ref={ref => ref && (charators.current.correct = ref)}
            name="charactorCorrect"
            position={[-145, -661]}
            textures={correctCharactorTextures}
            isPlaying={false}
            loop={true}
            initialFrame={0}
            visible={charators.current.correct ? charators.current.correct.visible : false}
            animationSpeed={0.3} />
         
         <AnimatedSprite
            ref={ref => ref && (charators.current.wrong = ref)}
            name="charactorWrong"
            position={[-145, -576]}
            textures={wrongCharactorTextures}
            isPlaying={false}
            initialFrame={0}
            loop={false}
            visible={charators.current.wrong ? charators.current.wrong.visible : false}
            animationSpeed={0.3} />

         <AnimatedSprite
            ref={ref => ref && (charators.current.bonus = ref)}
            name="charactorBonus"
            position={[-167, -623]}
            textures={bonusCharactorTextures}
            isPlaying={false}
            initialFrame={0}
            onComplete={onAnimationComp2}
            visible={charators.current.bonus ? charators.current.bonus.visible : false}
            animationSpeed={0.3} />

      </Container>
   );
});

export default memo(Charactor, () => true);