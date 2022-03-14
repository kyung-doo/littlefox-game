import { FC, ReactNode, useRef, useEffect, useCallback } from "react";
import { gsap, Expo } from 'gsap';
import { Draggable as GSAPDraggable } from "gsap/Draggable";
import { elementIndex } from "../../utils";
import { Sound } from "@pixi/sound";

/*
* @ PROPS
*     initSort: sort 초기값
*     image: 이미지 react node
*     imageWidth: 이미지 width 값
*     onClear: sort 완료 이벤트
*/
export interface Props {
   initSort: number[];
   image: ReactNode;
   imageWidth: number;
   onDragStart?: () => void;
   onClear?: () => void;
}

const Sortable: FC<Props> = ({ initSort, image, imageWidth, onDragStart, onClear }) => {

   const sortItems = useRef<HTMLDivElement[]>([]);
   const sliceWidth = useRef<number>(imageWidth/initSort.length);
   const draggables = useRef<GSAPDraggable[]>();
   const clickAudio = useRef<Sound>();
   const timer = useRef<any>(null);

   const startSortable = useCallback(() => {
      draggables.current = GSAPDraggable.create(sortItems.current, {
         type:'x',
         bounds: '.sort-items',
         onPress: function (e) {
            clickAudio.current!.play();
            if(onDragStart) {
               onDragStart();
            }
         },
         onDragStart: function ( e ) {
            const idx = elementIndex(this.target);
            const otherDraggable = draggables.current!.filter((x, i) => i !== idx);
            otherDraggable.forEach(draggble => draggble.disable());
         },
         onDrag: function ( e ) {
            const sortNum = parseInt(this.target.dataset.sort);
            const startX = sortNum * sliceWidth.current;
            const dist = this.x - startX;
            if(Math.abs(dist) > sliceWidth.current/2) {
               if(dist > 0) {
                  let moveTarget = findItem(sortNum+1);
                  moveTarget!.dataset.sort = `${sortNum}`;
                  moveItem(moveTarget!, 0.4);
                  this.target.dataset.sort = `${sortNum+1}`;
               } else {
                  let moveTarget = findItem(sortNum-1);
                  moveTarget!.dataset.sort = `${sortNum}`;
                  moveItem(moveTarget!, 0.4);
                  this.target.dataset.sort = `${sortNum-1}`;
               }
            }
         },
         onDragEnd: function () {
            draggables.current!.forEach(draggable => draggable.disable());
            moveItem(this.target, 0.3, () => {
               if(!checkClear()) {
                  draggables.current!.forEach(draggable => draggable.enable());
               } else {
                  if(onClear) {
                     timer.current = setTimeout(onClear, 100);
                  }
               }
            });
         }
      });
   }, []);
   

   const findItem = useCallback((num: number) => {
      return sortItems.current!.find( el => parseInt(el.dataset.sort!) === num);
   }, []);


   const moveItem = useCallback((item: HTMLDivElement, speed: number, callback?: () => void) => {
      const targetX = parseInt(item.dataset.sort as string) * sliceWidth.current;
      gsap.to(item, speed, { 
         x: targetX, 
         ease: Expo.easeOut,
         onComplete: callback
      });
   }, []);


   const checkClear = useCallback(() => {
      let count = 0;
      sortItems.current.forEach((item, i) => {
         if(parseInt(item.dataset.sort as string) === count) count++;
      });
      if(count === sortItems.current.length) {
         return true;
      }
      return false;
   }, []);


   useEffect(() => {
      clickAudio.current = Sound.from({url: require('../../assets/audio/click.mp3').default, preload: true});
      sortItems.current.forEach((item, i) => {
         gsap.set(item, { x: i * sliceWidth.current});
         gsap.to(item, 0.6, { 
            delay: 0.2, 
            x: initSort[i] * sliceWidth.current, 
            ease: Expo.easeInOut, 
            onComplete: startSortable 
         });
      });  
      
      return () => {
         gsap.killTweensOf(sortItems.current);
         draggables.current?.forEach( drag => drag.kill());
         clearTimeout(timer.current);
      }    
   }, []);

   return (
      <div className="sort-items">
         {initSort.map((num, i) => (
            <div ref={ref => ref && (sortItems.current[i] = ref)}
               key={`sort-item-${i}`} 
               className={`sort-item item${i+1}`} 
               data-sort={num}>
               <span>{image}</span>
            </div>
         ))}
      </div>
   );
}

export default Sortable;