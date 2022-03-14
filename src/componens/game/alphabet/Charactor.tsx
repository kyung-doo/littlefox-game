import { forwardRef, useMemo, useRef, useCallback, useImperativeHandle, memo } from "react";
import { _ReactPixi, Container, AnimatedSprite, PixiRef } from "@inlet/react-pixi";
import useAssets from "../../../hooks/useAssets";



/*
* @ REFS
*     bubble: 방울부는 애니메이션 시작
*     bonus: 보너스 애니메이션 시작
*/
export interface Refs {
   bubble: () => void;
   bonus: () => void;
}

const Charactor = forwardRef<Refs, _ReactPixi.IContainer>((props, ref) => {

   const { resources } = useAssets();
   const charators = useRef<{[key: string]: PixiRef<typeof AnimatedSprite>}>({});

   const defaultCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorDefault.textures).map( name => resources.spritesheetCharactorDefault.textures[name]);
   }, []);

   const bubbleCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorBubble.textures).map( name => resources.spritesheetCharactorBubble.textures[name]);
   }, []);

   const bonusCharactorTextures = useMemo(() => {
      return Object.keys(resources.spritesheetCharactorBonus.textures).map( name => resources.spritesheetCharactorBonus.textures[name]);
   }, []);

   const showDefault = useCallback(() => {
      charators.current.default.visible = true;
      charators.current.default.gotoAndPlay(0);
      charators.current.bubble.visible = false;
      charators.current.bubble.stop();
      charators.current.bonus.visible = false;
      charators.current.bonus.stop();
   },[]);

   const showBubble = useCallback(() => {
      charators.current.default.stop();
      charators.current.default.visible = false;
      charators.current.bubble.gotoAndPlay(0);
      charators.current.bubble.visible = true;
      charators.current.bonus.visible = false;
      charators.current.bonus.stop();
   }, []);

   const showBonus = useCallback(() => {
      charators.current.default.stop();
      charators.current.default.visible = false;
      charators.current.bubble.stop();
      charators.current.bubble.visible = false;
      charators.current.bonus.gotoAndPlay(0);
      charators.current.bonus.visible = true;
   }, []);
   

   useImperativeHandle(ref, () => ({
      bubble: () => showBubble(),
      bonus: () => showBonus()
   }));


   return (
      <Container {...props}>
         <AnimatedSprite
            ref={ref => ref && (charators.current.default = ref)}
            name="charactorDefault"
            position={[59, 443]}
            textures={defaultCharactorTextures}
            isPlaying={true}
            initialFrame={0}
            animationSpeed={0.2} />
            
         <AnimatedSprite
            ref={ref => ref && (charators.current.bubble = ref)}
            name="charactorBubble"
            position={[22, 453]}
            textures={bubbleCharactorTextures}
            isPlaying={false}
            loop={false}
            initialFrame={0}
            visible={charators.current.bubble ? charators.current.bubble.visible : false}
            onComplete={showDefault}
            animationSpeed={0.2} />
         
         <AnimatedSprite
            ref={ref => ref && (charators.current.bonus = ref)}
            name="charactorBubble"
            position={[70, 415]}
            textures={bonusCharactorTextures}
            isPlaying={false}
            initialFrame={0}
            visible={charators.current.bonus ? charators.current.bonus.visible : false}
            animationSpeed={0.2} />
      </Container>
   )
});

export default memo(Charactor, () => true);