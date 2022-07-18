import { FC, ReactElement, useEffect, useRef, useCallback } from "react";
import { addClass, removeClass, distance, elementIndex } from "../../utils";
import { gsap, Cubic } from "gsap";
import { Draggable as GSAPDraggable } from "gsap/Draggable";
import { Sound } from "@pixi/sound";

/*
* @ PROPS
*     areaAr: 드래그 영역 값 배열 
*     dragAr: 드래그 아이텝 값 배열
*     areaElm: 드래그 영역 element
*     dragElm :드래그 아이템 element
*     onCorrect : 드래그 정답 시 콜백
*     onWorng : 드래그 오답 시 콜백
*/
export interface Props {
   areaAr: string[] | number[];
   dragAr: string[] | number[];
   areaElm?: ReactElement[];
   dragElm?: ReactElement[];
   onDragStart?: ( item: HTMLDivElement ) => void;
   onCorrect?: (item: HTMLDivElement, area: HTMLDivElement) => void;
   onWrong?: (item: HTMLDivElement) => void;
}


const Draggable: FC<Props> = ({ 
   areaAr, 
   dragAr, 
   areaElm, 
   dragElm,
   onDragStart,
   onCorrect,
   onWrong 
}) => {

   const dragContainer = useRef<HTMLDivElement>(null);
   const dragItems = useRef<HTMLDivElement[]>([]);
   const dragAreas = useRef<HTMLDivElement[]>([]);
   const draggables = useRef<GSAPDraggable[]>();
   const clickAudio = useRef<Sound>();

   

   const checkHitArea = useCallback(( draggable: any, dragItem: HTMLDivElement): [boolean, HTMLDivElement] | null => {
      for(let i=0; i<dragAreas.current.length; i++) {
         var areaItem = dragAreas.current[i];
         if(getComputedStyle(areaItem)['visibility'] === 'hidden' || getComputedStyle(areaItem)['display'] === 'none') continue;
         if(draggable.hitTest(areaItem)){
            if(areaItem.dataset.correct === dragItem.dataset.correct) {
               return [true, areaItem];
            } else {
               return [false, areaItem];
            }
         }
      }
      return null;
   }, []);


   const returnDrag = useCallback((traget, dragItem) => {
      const dist = distance(traget.x, traget.y, 0, 0);
      gsap.to(dragItem, dist * 0.002, {
         x:0, y: 0, 
         ease:Cubic.easeOut, 
         onComplete: ()=>{
            draggables.current!.forEach(draggble => draggble.enable());
         }
      });
   },[]);

   
   useEffect(() => {
      clickAudio.current = Sound.from({url: require('../../assets/audio/click.mp3').default, preload: true});
      gsap.to(dragItems.current, 0.6, {y: 0, force3D: true, ease: Cubic.easeInOut, onComplete: () => {
         draggables.current = GSAPDraggable.create(dragItems.current, {
            type: 'x,y',
            bounds: '#content',
            onDragStart: function ( e ) {
               const idx = elementIndex(this.target);
               const otherDraggable = draggables.current!.filter((x, i) => i !== idx);
               otherDraggable.forEach(draggble => draggble.disable());
               clickAudio.current!.play();
               if(onDragStart){
                  onDragStart(dragItems.current[idx]);
               }
            },
            onDrag: function ( e ) {
               const idx = elementIndex(this.target);
               const dragItem = dragItems.current[idx];
               const hitArea = checkHitArea(this, dragItem);
               dragAreas.current.forEach(area => removeClass(area, 'hit'));
               if(hitArea) {
                  if(hitArea[1]) {
                     addClass(hitArea[1], 'hit');
                  }
               }
            },
            onDragEnd: function ( e ){
               const idx = elementIndex(this.target);
               const dragItem = dragItems.current[idx];
               this.disable();
               const hitArea = checkHitArea(this, dragItem);
               dragAreas.current.forEach(area => removeClass(area, 'hit'));
               if(hitArea) {
                  if(hitArea[0]) {
                     addClass(dragItem, 'active');
                     addClass(hitArea[1], 'active');
                     draggables.current!.forEach(draggble => draggble.enable());
                     if(onCorrect) {
                        onCorrect(dragItems.current[idx], hitArea[1]);
                     }
                  } else {
                     returnDrag(this, dragItem);
                     if(onWrong) {
                        onWrong(dragItem);
                     }
                  }
               } else {
                  returnDrag(this, dragItem);
               }
            }
         });
      }});

      return () => {
         gsap.killTweensOf(dragContainer.current);
         draggables.current?.forEach( drag => drag.kill());
      }
   }, []);

   return (
      <div ref={dragContainer} className="draggable">
         <div className="drag-areas">
            {areaAr.map((correct, i) => (
               <div key={`drag-area-${i}`} 
                  ref={ref => ref && (dragAreas.current[i]=ref)}
                  className="drag-area"
                  data-correct={correct}>
                  {areaElm && areaElm[i]}
               </div>
            ))}
         </div>
         <div className="drag-items">
            {dragAr.map((correct, i) => (
               <div key={`drag-item-${i}`} 
                  ref={ref => ref && (dragItems.current[i]=ref)}
                  className="drag-item"
                  data-correct={correct}>
                  {dragElm && dragElm[i]}
               </div>
            ))}
         </div>
      </div>
   );
}

export default Draggable;