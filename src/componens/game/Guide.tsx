import { memo, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Container, PixiRef, Sprite, _ReactPixi } from '@inlet/react-pixi';
import PixiButton from './PixiButton';
import { isMobile } from '../../utils';
import useAssets from '../../hooks/useAssets';
import { gsap, Expo } from 'gsap';


/*
* @ REFS
*     show: 가이드 보기
*/
export interface Refs {
   show: () => void;
}

const Guide = forwardRef<Refs, _ReactPixi.IContainer>((props, ref) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);

   const onClose = useCallback(( e ) => {
      gsap.to(container.current, 0.4, {alpha: 0, ease: Expo.easeOut, onComplete: () => {
         container.current!.interactive = false;
         container.current!.visible = false;
      }});
   }, []);

   useImperativeHandle(ref, ()=> ({
      show : () => {
         container.current!.visible = true;
         container.current!.interactive = true;
         gsap.to(container.current, 0.4, {alpha: 1});
      }
   }))
   
   return (
      <Container 
         ref={container}
         visible={container.current ? container.current.visible : false}
         alpha={container.current ? container.current.alpha : 0}
         interactive={container.current ? container.current.interactive :true}
         {...props}>

         <Sprite texture={resources.introGuide.texture} position={[-400, 0]} />

         <PixiButton 
            name="backBtn"
            position={[41, 29]}
            scale={isMobile() ? 1.5 : 1}
            defaultTexture={resources.commonBackBtn.texture}
            sound={resources.audioClick.sound}
            onTouchEnd={onClose}
            align="LEFT" />

      </Container>
   )
});

export default memo(Guide, () => true);