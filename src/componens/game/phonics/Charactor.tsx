import { forwardRef, useMemo, useRef, useCallback, useImperativeHandle, memo, useEffect } from "react";
import { _ReactPixi, Container, AnimatedSprite, PixiRef } from "@inlet/react-pixi";
import useAssets from "../../../hooks/useAssets";
import PIXITimeout from "../../../utils/PIXITimeout";



/*
* @ REFS
*     default: 기본 동작 애니메이션 시작
*     bonus: 보너스 애니메이션 시작
*/
export interface Refs {
   default: () => void;
   bonus: () => void;
}

const Charactor = forwardRef<Refs, _ReactPixi.IContainer>((props, ref) => {

   const { resources } = useAssets();
   const charators = useRef<{[key: string]: PixiRef<typeof AnimatedSprite>}>({});
   const timer = useRef<any>(null);

   const defaultCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorDefault.textures).map( name => resources.spritesheetCharactorDefault.textures[name]);
   }, []);

   const bonusCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorBonus.textures).map( name => resources.spritesheetCharactorBonus.textures[name]);
   }, []);

   const onAnimationComp = useCallback(() => {
      timer.current = PIXITimeout.start(() => charators.current.default.gotoAndPlay(0), 500);
   },[]);

   const showDefault = useCallback(() => {
      charators.current.default.visible = true;
      charators.current.default.gotoAndPlay(0);
      charators.current.bonus.visible = false;
      charators.current.bonus.stop();
   },[]);

   const showBonus = useCallback(() => {
      PIXITimeout.clear(timer.current);
      charators.current.default.stop();
      charators.current.default.visible = false;
      charators.current.bonus.gotoAndPlay(0);
      charators.current.bonus.visible = true;
   }, []);
   

   useImperativeHandle(ref, () => ({
      default: () => showDefault(),
      bonus: () => showBonus()
   }));

   useEffect(() => {
      return () => PIXITimeout.clear(timer.current);
   },[]);


   return (
      <Container {...props}>
         <AnimatedSprite
            ref={ref => ref && (charators.current.default = ref)}
            name="charactorDefault"
            position={[28, 570]}
            textures={defaultCharactorTextures}
            isPlaying={true}
            loop={false}
            onComplete={onAnimationComp}
            initialFrame={0}
            animationSpeed={0.2} />
         
         <AnimatedSprite
            ref={ref => ref && (charators.current.bonus = ref)}
            name="charactorBubble"
            position={[28, 480]}
            textures={bonusCharactorTextures}
            isPlaying={false}
            initialFrame={0}
            visible={charators.current.bonus ? charators.current.bonus.visible : false}
            animationSpeed={0.2} />
      </Container>
   )
});

export default memo(Charactor, () => true);