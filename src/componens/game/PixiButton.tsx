import { FC, useCallback, useLayoutEffect, useRef, useState, memo } from "react";
import { PixiRef, Sprite, useApp, _ReactPixi } from "@inlet/react-pixi";
import { Texture, Sprite as FIXISprite } from "pixi.js";
import { Sound } from "@pixi/sound";


/*
* @ PROPS
*     hover: 호버 사용 { active: 활성 유무, texture: 텍스쳐 }
*     toggle: 토글 사용 { active: 활성 유무, initToggle: 처음 토클 중인지 유무, texture: 텍스쳐 }
*     onTouchStart: 터치 스타트 이벤트 콜백
*     onTouchEnd: 터치 스타트 이벤트 콜백
*     onToggle: 토글 이벤트 콜백
*     sound: 터치 사운드
*     align: 가변 타입
*/
export interface Props extends _ReactPixi.ISprite {
   defaultTexture: Texture;
   hover?: {
      active: boolean;
      texture?: Texture | undefined;
   }
   toggle?: {
      active: boolean;
      initToggle?: boolean;
      texture?: Texture | undefined;
   },
   onTouchStart?: ( target?: FIXISprite ) => void;
   onTouchEnd?: ( target?: FIXISprite ) => void;
   onToggle?:  ( target?: FIXISprite, isToggle?: boolean ) => void;
   sound?: Sound;
   align?: 'LEFT' | 'RIGHT';
}



const PixiButton: FC<Props> = ({
   defaultTexture,
   hover,
   toggle,
   onTouchStart,
   onTouchEnd,
   onToggle,
   sound,
   align,
   position,
   ...spriteProps
}) => {
   
   const buttonRef = useRef<PixiRef<typeof Sprite>>(null);
   const [texture, setTexture] = useState<Texture>(toggle?.initToggle ? toggle?.texture ? toggle?.texture : defaultTexture : defaultTexture);
   const isTouch = useRef<boolean>(false);
   const [isToggle, setIsToggle] = useState<boolean>(toggle?.initToggle ? true: false);
   const app = useApp();
   const initX = useRef<number>(0);

   const onPointOver = useCallback(( e ) => {
      if(hover?.active) {
         if(hover.texture){
            setTexture(hover.texture);
         }
      }
   }, []);

   const onPointDown = useCallback(( e ) => {
      isTouch.current = true;
      if(hover?.active) {
         if(hover.texture){
            setTexture(hover.texture);
         }
      }
      if(onTouchStart) {
         onTouchStart(buttonRef.current!);
      }
      if(sound) {
         sound.play();
      }
   }, [isToggle, onTouchStart, onTouchEnd, onToggle]);

   const onPointOut = useCallback(( e ) => {
      if(toggle?.active){
         if(isToggle) {
            setTexture(toggle.texture!);
         } else {
            setTexture(defaultTexture);
         }
      } else {
         setTexture(defaultTexture);
      }
      isTouch.current = false;
   }, [isToggle, onTouchStart, onTouchEnd, onToggle]);

   const onPointUp = useCallback(( e ) => {
      if(isTouch.current){
         if(toggle?.active) {
            setIsToggle((prefState) => {
               if(toggle.texture) {
                  if(!prefState){
                     setTexture(toggle.texture);
                  } else {
                     setTexture(defaultTexture);
                  }
                  
               }
               return !isToggle;
            });
            if(onToggle) {
               onToggle(buttonRef.current!, isToggle);
            }
         } else {
            setTexture(defaultTexture);
         }
         if(onTouchEnd) {
            onTouchEnd(buttonRef.current!);
         }
      }
      isTouch.current = false;
   }, [isToggle, onTouchStart, onTouchEnd, onToggle]);

   const setBtnPos = useCallback(() => {
      let moveX = app.stage.children[0].position.x * (1/window.scale);
      if(moveX > 400) moveX = 400;
      if(align === 'LEFT') {
         buttonRef.current!.position.x = initX.current - moveX;
      } else if(align === 'RIGHT') {
         buttonRef.current!.position.x = initX.current + moveX;
      }
   },[]);

   const resizeApp = useCallback(() => {
      if(buttonRef.current) {
         setTimeout(() => setBtnPos(), 1);
      }
   },[]);
   

   useLayoutEffect(() => {
      initX.current = buttonRef.current!.position.x;
      if(align) {
         window.addEventListener('resize', resizeApp);
         setBtnPos();
      }
      return () => {
         window.removeEventListener('resize', resizeApp);
      }
   },[]);

   return (
      <Sprite 
         ref={buttonRef}
         position={buttonRef.current ? buttonRef.current.position : position}
         buttonMode={true}
         interactive={true}
         texture={texture} 
         pointerover={onPointOver}
         pointerdown={onPointDown}
         pointerout={onPointOut}
         pointerupoutside={onPointOut}
         pointerup={onPointUp}
         {...spriteProps} />
   );
}

export default memo(PixiButton, () => true);