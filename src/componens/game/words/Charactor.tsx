import { forwardRef, useMemo, useRef, useCallback, useImperativeHandle, memo } from "react";
import { _ReactPixi, Container, AnimatedSprite, PixiRef } from "@inlet/react-pixi";
import useAssets from "../../../hooks/useAssets";
import PIXITimeout from "../../../utils/PIXITimeout";

/*
* @ REFS
*     default: 기본 애니메이션 시작
*     correct: 정답 애니메이션 시작
*     wrong: 오답 애니메이션 시작
*/
export interface Refs {
   default: () => void;
   correct: () => void;
   wrong: () => void;
}

const Charactor = forwardRef<Refs, _ReactPixi.IContainer>((props, ref) => {

   const { resources } = useAssets();
   const charators = useRef<{[key: string]: PixiRef<typeof AnimatedSprite>}>({});
   const timer = useRef<any>(null);
   const isCorrect = useRef<boolean>(false);

   const defaultCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorDefault.textures).map( name => resources.spritesheetCharactorDefault.textures[name]);
   }, []);

   const correctCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorCorrect.textures).map( name => resources.spritesheetCharactorCorrect.textures[name]);
   }, []);

   const wrongcorrectCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorWrong.textures).map( name => resources.spritesheetCharactorWrong.textures[name]);
   }, []);

   
   const showDefault = useCallback(() => {
      charators.current.default.visible = true;
      charators.current.default.gotoAndPlay(0);
      charators.current.correct.visible = false;
      charators.current.correct.stop();
      charators.current.wrong.visible = false;
      charators.current.wrong.stop();
      isCorrect.current = false;
      PIXITimeout.clear(timer.current);
   },[]);

   const showCorrect = useCallback(() => {
      if(!isCorrect.current){
         charators.current.default.visible = false;
         charators.current.default.stop();
         charators.current.correct.visible = true;
         charators.current.correct.gotoAndPlay(0);
         charators.current.wrong.visible = false;
         charators.current.wrong.stop();
         isCorrect.current = true;
         timer.current = PIXITimeout.start(() => isCorrect.current = false, 500);
      } 
   }, []);

   const showWrong = useCallback(() => {
      charators.current.default.visible = false;
      charators.current.default.stop();
      charators.current.correct.visible = false;
      charators.current.correct.stop();
      charators.current.wrong.visible = true;
      charators.current.wrong.gotoAndPlay(0);
   }, []);
   

   useImperativeHandle(ref, () => ({
      default: () => showDefault(),
      correct: () => showCorrect(),
      wrong: () => showWrong()
   }));


   return (
      <Container {...props}>
         <AnimatedSprite
            ref={ref => ref && (charators.current.default = ref)}
            name="charactorDefault"
            position={[50, 530]}
            textures={defaultCharactorTextures}
            isPlaying={true}
            initialFrame={7}
            animationSpeed={0.2} />
         
         <AnimatedSprite
            ref={ref => ref && (charators.current.correct = ref)}
            name="charactorCorrect"
            position={[-8, 520]}
            textures={correctCharactorTextures}
            isPlaying={false}
            loop={false}
            initialFrame={0}
            visible={charators.current.correct ? charators.current.correct.visible : false}
            onComplete={showDefault}
            animationSpeed={0.2} />
            
         <AnimatedSprite
            ref={ref => ref && (charators.current.wrong = ref)}
            name="charactorWrong"
            position={[55, 530]}
            textures={wrongcorrectCharactorTextures}
            isPlaying={false}
            loop={false}
            initialFrame={0}
            onComplete={showDefault}
            visible={charators.current.wrong ? charators.current.wrong.visible : false}
            animationSpeed={0.2} />
      </Container>
   )
});

export default memo(Charactor, () => true);