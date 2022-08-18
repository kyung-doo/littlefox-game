import { useEffect, useRef, useImperativeHandle, memo, useCallback, useState, forwardRef } from 'react';
import { _ReactPixi, Container, PixiRef, Sprite } from '@inlet/react-pixi';
import { Container as PIXIContainer, Text as PIXIText, Sprite as PIXISprite, Texture } from 'pixi.js';
import { gsap, Cubic } from 'gsap';
import useAssets from '../../../hooks/useAssets';
import { makeRandomIgnoreFirst } from '../../../utils';
import PIXITimeout from '../../../utils/PIXITimeout';


export interface Props extends _ReactPixi.IContainer {
   words: string | string[];
}

export interface Refs {
   isCorrect: () => boolean;
}

const PICKER_HEIGHT: number = 209;
const TEXT_STYLE = {
   fontSize: 115,
   fontFamily: 'LexendDeca-Bold',
   fill: '#000'
}




const WordPicker = forwardRef<Refs, Props>(({words, ...props}, ref) => {

   const { resources } = useAssets();
   const container = useRef<PixiRef<typeof Container>>(null);
   const pickerCon = useRef<PixiRef<typeof Container>>(null);
   const [isHold, setIsHold] = useState<boolean>(false);
   const startPointerY = useRef<number>(0);
   const startPosY = useRef<number>(0);
   const isDrag = useRef<number>(-1);
   const isDraging = useRef<boolean>(false);
   const pickNum = useRef<number>(0);
   const oldPickNum = useRef<number>(0);
   const [isTransition, setIsTransition] = useState<boolean>(false);
   const pickData = useRef<{word: string, correct: boolean}[]>([]);
   const timer = useRef<any>();
  

   const makePicker = useCallback(() => {
      if(typeof words === 'object'){
         const bg = new PIXISprite(Texture.EMPTY);
         bg.width = 259;
         bg.height = PICKER_HEIGHT * (words.length+2)
         pickerCon.current?.addChild(bg);

         makeRandomIgnoreFirst(0, words.length, words.length).forEach((num, i) => {
            if(i === 0)    pickData.current[num] = { word: words[i], correct: true }
            else           pickData.current[num] = { word: words[i], correct: false }
         });

         // Array.from(Array(words.length), (k, i) => i).forEach((num, i) => {
         //    if(i === 0)    pickData.current[num] = { word: words[i], correct: true }
         //    else           pickData.current[num] = { word: words[i], correct: false }
         // });
         
         words.forEach((word: any, i) => {
            const picker: PIXIContainer = new PIXIContainer();
            picker.position.y = PICKER_HEIGHT * i;
            const text: PIXIText = new PIXIText(pickData.current[i].word, TEXT_STYLE);
            text.position.set(130, 105);
            text.anchor.set(0.5);
            picker.addChild(text);
            pickerCon.current?.addChild(picker);
         });
         maekUpDownPicker();
      } else {
         setIsHold(true);
         const picker: PIXIContainer = new PIXIContainer();
         const text: PIXIText = new PIXIText(words, TEXT_STYLE);
         text.position.set(130, 105);
         text.anchor.set(0.5);
         picker.addChild(text);
         pickerCon.current?.addChild(picker);
      }
   }, []);

   const maekUpDownPicker = useCallback(() => {
      const upPicker: PIXIContainer = new PIXIContainer();
      upPicker.position.y = -PICKER_HEIGHT;
      const upText: PIXIText = new PIXIText(pickData.current[words.length-1].word, TEXT_STYLE);
      upText.position.set(130, 105);
      upText.anchor.set(0.5);
      upPicker.addChild(upText);
      pickerCon.current?.addChild(upPicker);

      const downPicker: PIXIContainer = new PIXIContainer();
      downPicker.position.y = PICKER_HEIGHT * words.length;
      const downText: PIXIText = new PIXIText(pickData.current[0].word, TEXT_STYLE);
      downText.position.set(130, 105);
      downText.anchor.set(0.5);
      downPicker.addChild(downText);
      pickerCon.current?.addChild(downPicker);
      makeDragging();
   }, []);

   const makeDragging = useCallback(() => {
      pickerCon.current!.on('pointerdown', onDragStart);
      pickerCon.current!.on('pointerup', onDragEnd);
      pickerCon.current!.on('pointerupoutside', onDragEnd);
      pickerCon.current!.on('pointermove', onDragMove);
      
   }, []);


   const onDragStart = useCallback(( e: any ) => {
      startPointerY.current = e.data.global.y;
      startPosY.current = pickerCon.current!.position.y;
      isDrag.current = e.data.pointerId;
   }, []);

   const onDragMove = useCallback(( e: any ) => {
      if(isDrag.current === e.data.pointerId) {
         isDraging.current = true;
         const targetY: number = e.data.global.y - startPointerY.current;
         let scale = 1 - window.scale;
         if(scale < 0.3) scale = 0.3;
         pickerCon.current!.position.y = startPosY.current + (targetY *  (5 * scale));
         const y = pickerCon.current!.position.y;
         pickNum.current = Math.round(-pickerCon.current!.position.y / PICKER_HEIGHT);
         if(pickerCon.current!.position.y > 0) {
            pickerCon.current!.position.y = -PICKER_HEIGHT * words.length + y;
         } else if(pickerCon.current!.position.y < -PICKER_HEIGHT * (words.length-1)) {
            pickerCon.current!.position.y = PICKER_HEIGHT * (words.length) + y;
         }
         if(pickNum.current < 0) {
            pickNum.current = words.length + pickNum.current;
         }
         if(pickNum.current > words.length-1) {
            pickNum.current = pickNum.current - words.length;
         }
         if(oldPickNum.current !== pickNum.current){
            resources.audioClick.sound.stop();
            resources.audioClick.sound.play();
            oldPickNum.current = pickNum.current;  
         }
      }
   }, []);


   const onDragEnd = useCallback(( e: any ) => {
      isDraging.current = false;
      timer.current = PIXITimeout.start(() => isDrag.current = -1, 100);
      const targetY = -PICKER_HEIGHT * pickNum.current;
      if(pickNum.current === 0 && pickerCon.current!.position.y < -(PICKER_HEIGHT/2)) {
         pickerCon.current!.position.y += PICKER_HEIGHT * words.length;
      }
      else if(pickNum.current === words.length-1 && pickerCon.current!.position.y > 0) {
         pickerCon.current!.position.y -= PICKER_HEIGHT * words.length;
      }
      setIsTransition(true);
      gsap.to(pickerCon.current, 0.4, { pixi: {y: targetY}, ease: Cubic.easeOut, onComplete: () => setIsTransition(false)});
   }, []);


   const onBtnUp = useCallback(() => {
      if(isDraging.current) return;
      setIsTransition(true);
      if(pickNum.current < words.length-1) {
         pickNum.current++;
         const targetY = -PICKER_HEIGHT * pickNum.current;
         gsap.to(pickerCon.current, 0.4, { pixi: {y: targetY}, ease: Cubic.easeOut, onComplete: () => setIsTransition(false)});
      } else {
         pickNum.current = 0;
         pickerCon.current!.position.y = PICKER_HEIGHT;
         const targetY = -PICKER_HEIGHT * pickNum.current;
         gsap.to(pickerCon.current, 0.4, { pixi: {y: targetY}, ease: Cubic.easeOut, onComplete: () => setIsTransition(false)});
      }
      resources.audioClick.sound.stop();
      resources.audioClick.sound.play();
   }, []);

   const onBtnDown = useCallback(() => {
      if(isDraging.current) return;
      setIsTransition(true);
      if(pickNum.current > 0) {
         pickNum.current--;
         const targetY = -PICKER_HEIGHT * pickNum.current;
         gsap.to(pickerCon.current, 0.4, { pixi: {y: targetY}, ease: Cubic.easeOut, onComplete: () => setIsTransition(false)});
      } else {
         pickNum.current = words.length-1;
         pickerCon.current!.position.y = -PICKER_HEIGHT * words.length;
         const targetY = -PICKER_HEIGHT * pickNum.current;
         gsap.to(pickerCon.current, 0.4, { pixi: {y: targetY}, ease: Cubic.easeOut, onComplete: () => setIsTransition(false)});
      }
      resources.audioClick.sound.stop();
      resources.audioClick.sound.play();
   }, []);

   useImperativeHandle(ref, () => ({
      isCorrect: () => {
         return typeof words === 'object' ? pickData.current[pickNum.current].correct : true;
      }
   }));

   useEffect(() => {
      const mask = new PIXISprite(Texture.WHITE);
      mask.width = 259;
      mask.height = 209;
      mask.position.y = 80;
      container.current!.addChild(mask);
      pickerCon.current!.mask = mask;
      makePicker();
      return () => {
         PIXITimeout.clear(timer.current);
      }
   }, []);

   return (
      <Container ref={container} {...props} interactiveChildren={!isTransition}>
         <Sprite 
            name="pickerBg" 
            texture={resources.mainPickerBg.texture} />

         <Container
            name="pickerWrap"
            position={[0, 80]}>
             <Container ref={pickerCon}
               name="pickerCon"
               interactive={true}
               buttonMode={true} />
         </Container>
         
         {!isHold &&
            <>
               <Sprite 
                  name="btnUp"
                  texture={resources.mainPickerUp.texture}
                  position={[56, 0]}   
                  interactive={true}
                  pointerup={onBtnUp}
                  buttonMode={true} />

               <Sprite 
                  name="btnDown"
                  texture={resources.mainPickerDown.texture}
                  position={[56, 288]}   
                  interactive={true}
                  pointerup={onBtnDown}
                  buttonMode={true} />
            </>
         }

      </Container>
   );
});

export default memo(WordPicker, () => true);