import { useEffect, useRef, FC, memo } from 'react';
import { _ReactPixi, Container, PixiRef, Sprite } from '@inlet/react-pixi';
import { Container as PIXIContainer, Sprite as PIXISprite } from 'pixi.js';
import { gsap } from 'gsap';
import useAssets from '../../../hooks/useAssets';



const WordPicker: FC<_ReactPixi.IContainer> = ( props ) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);   

   useEffect(() => {
      
   }, []);

   return (
      <Container ref={container} {...props}>
         {/* <Sprite 
            name="pickerBg" 
            texture={resources.mainPickerBg} /> */}
      </Container>
   );
}

export default memo(WordPicker, () => true);