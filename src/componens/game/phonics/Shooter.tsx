import { memo, useCallback, useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Container, Sprite, _ReactPixi, Graphics, PixiRef, useApp } from "@inlet/react-pixi";
import { Container as PIXIContainer, Sprite as PIXISprite, Texture, SimpleRope, IPoint, Point, BLEND_MODES } from "pixi.js";
import { Container3d as PIXIContainer3d, Sprite3d as PIXISprite3d } from 'pixi-projection';
import { gsap, Elastic, Power3, Power2, Linear, Cubic } from "gsap";
import Camera3d from "../pixi-projection/Camera3d";
import Container3d from "../pixi-projection/Container3d";
import { cubicInterpolation, randomRange, toRadian } from "../../../utils";
import AimPoint, { Refs as AimPointRefs } from "./AimPoint";
import PIXITimeout from "../../../utils/PIXITimeout";
import useAssets from "../../../hooks/useAssets";
import { useSelector } from "react-redux";

const MAXIMUM_X = 420;


/*
* @ PORPS
*     hitPositions: 과녁 위치 배열
*     onShootCorrect: 화살이 정답 과녁에 쏘았을 때 콜백
*     onShootWrong: 화살이 오답 과녁에 쏘았을 때 콜백
*     onShootBonus: 보너스 이펙트가 실행시 콜백
*/
export interface Props extends _ReactPixi.IContainer {
   hitPositions: number[];
   onShootCorrect: ( correct: number, pointX: number, finish: boolean ) => void;
   onShootWrong: ( wrong: number, pointX: number ) => void;
   onShootBonus: ( num: number, pointX: number, isLast: boolean ) => void;
}


/*
* @ REFS
*     start: 화살을 쏠 수 있게
*     finish: 제한 시간안에 못 맞출경우 호출
*     shootBonus1: 보너스 에펙트 1번 보기
*     shootBonus2: 보너스 에펙트 2번 보기
*     disable: 화살을 쏠 수 없게
*/
export interface Refs {
   start: (wordList: {[key: string]: any}[], correctWord: string[]) => void;
   finish: (delay: number) => void;
   shootBonus1: () => void;
   shootBonus2: () => void;
   disable: () => void;
}


const Shooter = forwardRef<Refs, Props>(({ hitPositions, onShootCorrect, onShootWrong, onShootBonus, ...props }, ref) => {

   const { resources } = useAssets();
   const app = useApp();

   const step: any = useSelector<any>(state => state.root.step);
   const gameData: any = useSelector<any>(state => state.root.gameData);
   

   const [wordLists, setWordLists] = useState<{[key: string]: any}[]>([]);
   const [correctWords, setCorrectWords] = useState<string[]>([]);

   const curvePoint = useRef<{value: number}>({ value: 0 });

   const isTouch = useRef<boolean>(false);
   const isShoot = useRef<boolean>(false);
   const isShowArrow = useRef<boolean>(false);

   const container = useRef<PixiRef<typeof Container>>(null);
   const shootCon = useRef<PixiRef<typeof Container>>(null);
   const shootLine = useRef<PixiRef<typeof Graphics>>(null);
   const shootArrows = useRef<PIXIContainer3d[]>([]);
   const paticleCon = useRef<PIXIContainer3d>(null);
   const aimPoint = useRef<AimPointRefs>(null);
   
   const arrowCount = useRef<number>(0);
   const [arrows, setArrows] = useState<{ id: string }[]>([]);

   const [canShoot, setCanShoot] = useState<boolean>(false);
   const [canBonusShoot1, setCanBonusShoot1] = useState<boolean>(false);
   const [canBonusShoot2, setCanBonusShoot2] = useState<boolean>(false);

   const correctIndex = useRef<number[]>([]);
   const timer = useRef<any>(null);
   

   

   const drawShootLine = useCallback((point: number) => {
      if(shootLine.current){
         shootLine.current.cacheAsBitmap = false;
         shootLine.current.clear();
         shootLine.current.lineStyle(5, 0x462c0f);
         shootLine.current.moveTo(-95, 0);
         shootLine.current.bezierCurveTo(0, point, 0, point, 95, 0);
         shootLine.current.cacheAsBitmap = true;
      }
   }, []);


   const fullArrow = useCallback((first?: boolean) => {
      const arrowCon = currentArrow();
      const update = () => {
         arrowCon.position3d.y = 905 + (curvePoint.current.value * 0.7);
         drawShootLine(curvePoint.current.value);
      }
      gsap.killTweensOf(curvePoint.current);
      curvePoint.current.value = 0;
      gsap.to(curvePoint.current!, first ? 0.4 : 0.6, {value: 25, 
         onUpdate: update,
         ease: Linear.easeNone,
         onComplete: () => {   
            if(!first) {
               gsap.to(curvePoint.current!, 0.2, { value: 20, yoyo: true, repeat: -1, onUpdate: update, ease: Linear.easeNone });
            } else {
               gsap.to(curvePoint.current!, 0.4, { value: 0, yoyo: true, repeat: -1, onUpdate: update, ease: Linear.easeNone });
            }   
         }
      });
   },[])


   const onTouchStart = useCallback((e: any) => {
      isTouch.current = true;
      const hit = checkHitTarget(shootCon.current!.position.x);
      aimPoint.current!.moveTo(hit.x+1024, hit.num === -1 ? false: true);
      resources.audioClick.sound.stop();
      resources.audioClick.sound.play();
      if(!canShoot) return;
      fullArrow();
   },[canShoot]);


   const onTouchMove = useCallback(( e: any ) => {
      if(isTouch.current){
         let targetX = (e.data.global.x - app.stage.children[0].position.x) * (1/window.scale);
         if(targetX < MAXIMUM_X) targetX = MAXIMUM_X;
         if(targetX > 2048-MAXIMUM_X) targetX = 2048-MAXIMUM_X;
         const arrowCon = currentArrow();
         shootCon.current!.position.x = targetX;
         if(!isShoot.current){
            arrowCon.position3d.x = targetX-1024;
         }
         const hit = checkHitTarget(shootCon.current!.position.x);
         aimPoint.current!.moveTo(hit.x+1024, hit.num === -1 ? false: true);
      }
   },[canShoot]);


   const onTouchEnd = useCallback(( e: any ) => {
      isTouch.current = false;
      aimPoint.current!.hide();     
      if(!canShoot) return;
      app.stage.getChildByName('shootTargetCam', true).zIndex = 0;
      container.current!.zIndex = 1;
      resources.audioArrowShoot.sound.play();
      setCanShoot(false);
      isShoot.current = true;
      gsap.killTweensOf(curvePoint.current!)
      gsap.to(curvePoint.current!, 1, {
         value: 0, 
         onUpdate: () => {
            drawShootLine(curvePoint.current.value);
         },
         ease: Elastic.easeOut.config(3)
      });

      const hit = checkHitTarget(shootCon.current!.position.x);
      if(hit.num > -1){
         hitShoot(hit);
      } else {
         noHitShoot();
      } 
      
   }, [canShoot]);


   const hitShoot = useCallback(( hit ) => {
      const arrowCon = currentArrow();
      gsap.to(arrowCon.position3d, 0.8, { 
         z: 800, 
         ease: Power2.easeOut, 
         onUpdateParams: [arrowCon, 700], 
         onUpdate: gameData.lowQuality === 0 ? onUpdateAni : undefined 
      });
      gsap.to(arrowCon.scale3d, 0.8, { x: 0.7, y: 0.7, z: 0.7, ease: Power2.easeOut });
      gsap.to(arrowCon.position3d, 0.25, { y: 720, ease: Linear.easeNone });
      gsap.to(arrowCon.position3d, 0.4, { delay: 0.25, y: 780, ease: Linear.easeNone });
      gsap.to(arrowCon.euler, 0.7, { x: -Math.PI/1.6, ease: Power2.easeOut });

      if(correctWords[correctIndex.current.length] === wordLists[hit.num].word) {
         correctIndex.current.push(hit.num);
         gsap.to(arrowCon.position3d, 0.3, { delay: 0.7, z: `+=40`, y: `+=40`, ease: Power2.easeOut });
         gsap.to(arrowCon, 0.3, { delay: 0.8, alpha: 0, onCompleteParams: [arrowCon], onComplete: removeArrow });
         if(correctIndex.current.length < correctWords.length) {
            onShootCorrect(hit.num, hit.x, false);   
            makeArrow(500);
         } else {
            onShootCorrect(hit.num, hit.x, true);
         }
      } else {
         gsap.to(arrowCon.position3d, 0.3, { delay: 0.7, y: 900, x: `+=${randomRange(-15, 15)}`, ease: Power2.easeOut });
         gsap.to(arrowCon.euler, 0.3, { delay: 0.7, x: `-=${toRadian(30)}`, z: `-=${toRadian(randomRange(-30, 30))}`, ease: Power2.easeOut});
         gsap.to(arrowCon, 0.3, { delay: 0.8, alpha: 0,  onCompleteParams: [arrowCon], onComplete: removeArrow });
         onShootWrong(hit.num, hit.x);
         makeArrow(500);
      }
   }, [onShootCorrect, wordLists, correctWords]);



   const noHitShoot = useCallback(() => {
      const arrowCon = currentArrow();
      gsap.to(arrowCon.position3d, 1, { 
         z: 1200, 
         ease: Power2.easeOut, 
         onUpdateParams: [arrowCon, 1000], 
         onUpdate:  gameData.lowQuality === 0 ? onUpdateAni : undefined, 
         onCompleteParams: [arrowCon], onComplete: removeArrow 
      });
      gsap.to(arrowCon.scale3d, 1, { x: 0.7, y: 0.7, z: 0.7, ease: Power2.easeOut });
      gsap.to(arrowCon.position3d, 0.25, { y: 720, ease: Linear.easeNone });
      gsap.to(arrowCon.position3d, 0.5, { delay: 0.25, y: 800, ease: Linear.easeNone });
      gsap.to(arrowCon.euler, 0.9, { x: -Math.PI/1.65, ease: Power2.easeOut });
      gsap.to(arrowCon, 0.5, { delay: 0.5, alpha:0 });
      timer.current = PIXITimeout.start(() => {
         app.stage.getChildByName('shootTargetCam', true).zIndex = 1;
         container.current!.zIndex = 0;
      }, 300);
      makeArrow(500);
   }, [onShootWrong]);



   const onUpdateAni = useCallback(( arrowCon, maxZ, isBonus ) => {
      const tintAr = [0xda88f2, 0x86e2ff, 0xacff86, 0xedfb6c, 0xff9d8d];
      if(arrowCon.position3d.z < maxZ) {
         const particle = new PIXISprite3d(resources.mainStar.texture);
         particle.anchor.set(0.5);
         particle.position3d.x = arrowCon.position3d.x;
         particle.position3d.y = arrowCon.position3d.y;
         particle.position3d.z = arrowCon.position3d.z-50;
         particle.scale3d.x = 0;
         particle.scale3d.y = 0;
         particle.alpha = 0;
         particle.roundPixels = true;
         if(isBonus){
            particle.tint= tintAr[randomRange(0, tintAr.length-1)];
            gsap.set(particle, {pixi: {brightness: 1.5}});
         }
         const scale = ((1500 - arrowCon.position3d.z) * 0.001);
         paticleCon.current?.addChild(particle);
         gsap.to(particle.position3d, 1, { x: `+=${randomRange(-100, 100)*scale}`, y: `+=${randomRange(50, 150)*scale}`, z: `+=${randomRange(30, 50)}`, ease: Linear.easeInOut });
         gsap.to(particle.scale3d, 1, { x: scale, y: scale, z: scale});
         gsap.to(particle.euler, 1, { z: `+=${toRadian(randomRange(-360, 360))}`});
         gsap.to(particle, 0.2, {pixi: { alpha: scale * 0.8 }});
         gsap.to(particle, 0.3, {delay: 0.5, pixi: { alpha: 0 }, onComplete: () => {
            try{
               particle.destroy();
            } catch(e){}
         }});
         
      }
   },[]);


   const checkHitTarget = useCallback(( posX: number ) => {
      const x =  (posX - 1024) * 0.85;
      let hit = -1;
      hitPositions.forEach((point, i) => {
         if(x < point + 75 && x > point - 75) hit = i;
      });
      if(correctIndex.current.indexOf(hit) > -1) hit = -1;
      return {num: hit, x: x};
   }, []);


   const makeArrow = useCallback((delay) => {
      timer.current = PIXITimeout.start(() => {
         arrowCount.current++;
         setArrows(prevState => [...prevState, { id: `shootArrowCon${arrowCount.current}` }]);
         setCanShoot(true);
      }, delay);
   }, []);

   const removeArrow = useCallback(( arrow ) => {
      setArrows(prevState => prevState.filter(x => x.id !== arrow.name));
   }, []);


   const currentArrow = useCallback(() => {
      return shootArrows.current.find(x => x.name === `shootArrowCon${arrowCount.current}`) as PIXIContainer3d;
   }, []);

   const disableShooter = useCallback(() => {
      isTouch.current = false;
      setCanShoot(false);
      aimPoint.current?.hide();
      PIXITimeout.clear(timer.current);
      container.current!.interactiveChildren = false;
      app.stage.interactive = false;
      app.stage.off('pointermove');
      if(!isShoot.current) {
         drawShootLine(0);
         gsap.killTweensOf(curvePoint.current);
         const arrowCon = currentArrow();
         if(arrowCon) arrowCon.position3d.y = 905;
      }
   }, []);
   

   const clearArrows = useCallback(() => {
      arrowCount.current=0;
      isShoot.current = false;
      setArrows([]);
      setCanShoot(false);
      shootArrows.current = [];
   }, []);


   const bonusEffect1 = useCallback(() => {
      const wrongList: number[] = [];
      wordLists.forEach((list, i) => !list.correct && wrongList.push(i));
      resources.audioArrowShoot.sound.play();
      shootArrows.current.forEach((arrowCon, i) => {
         const x = hitPositions[wrongList[i]] * 1.15;
         gsap.to(arrowCon.position3d, 0.8, { 
            z: 800,  
            x: x, 
            ease: Power2.easeOut, 
            onUpdateParams: [arrowCon, 700, true], 
            onUpdate: gameData.lowQuality === 0 ? onUpdateAni : undefined
         });
         gsap.to(arrowCon.scale3d, 0.8, { x: 0.7, y: 0.7, z: 0.7, ease: Power2.easeOut });
         gsap.to(arrowCon.position3d, 0.3, { y: 720,  ease: Linear.easeNone  });
         gsap.to(arrowCon.position3d, 0.4, { delay: 0.3, y: 780, ease: Linear.easeNone });
         gsap.to(arrowCon.euler, 0.7, { x: -Math.PI/1.6, ease: Power2.easeOut });
         gsap.to(arrowCon.euler, 0.3, { z: toRadian(x/40), ease: Power2.easeOut });
         gsap.to(arrowCon.position3d, 0.3, { delay: 0.7, z: `+=40`, y: `+=40`, x: `+=${x/40}`, ease: Power2.easeOut });
         gsap.to(arrowCon, 0.3, { delay: 0.8, alpha: 0, onCompleteParams: [arrowCon], onComplete: (arrowCon) => removeArrow(arrowCon)});
         onShootBonus(wrongList[i], hitPositions[wrongList[i]], i === wrongList.length - 1);
      });
   },[wordLists]);



   const bonusEffect2 = useCallback(() => {

      const wrongList: number[] = [];
      wordLists.forEach((list, i) => !list.correct && wrongList.push(i));

      const historySize = 50;
      const ropeSize = 120;
      const points: IPoint[] = [];
      const historyX: number[] = [];
      const historyY: number[] = [];
      const arrowCon = shootArrows.current[0] as PIXIContainer;
      Array.from(Array(ropeSize), (k, i) => {
         points.push( new Point(arrowCon.position.x, 0));
      });
      Array.from(Array(historySize), (k, i) => {
         historyX.push(arrowCon.position.x);
         historyY.push(0);
      });
      const rope = new SimpleRope(resources.mainBlurCircle.texture, points);
      rope.alpha = 0.9;
      rope.position.y = 970;
      paticleCon.current!.addChild(rope);
      gsap.to(arrowCon.position, 2, { 
         motionPath: {
            path: [{x: -630, y: 780}, {x: -520, y: 680}, {x: 1500, y: 730}],
            curviness: 1.5
         },
         onUpdate: function () {
            historyX.pop();
            historyX.unshift(arrowCon.position.x);
            historyY.pop();
            historyY.unshift(arrowCon.position.y - 970);
            if(this.progress() > 0.37) {
               points.forEach((point, i) => {
                  point.x = cubicInterpolation(historyX, i / ropeSize * historySize);
                  point.y = cubicInterpolation(historyY, i / ropeSize * historySize);
                  if(i < 50 && randomRange(0, 20) === 0) {
                     const rand = randomRange(0, 1);
                     let texture;
                     if(rand === 0) {
                        texture = resources.mainLight.texture;
                     } else if(rand === 1) {
                        texture = resources.mainBlurCircle.texture;
                     }
                     if(gameData.lowQuality === 0){
                        const particle = new PIXISprite(texture);
                        particle.x = point.x;
                        particle.y = (point.y+970) + randomRange(-100 * arrowCon.scale.x, 100 * arrowCon.scale.x);
                        particle.alpha = 0;
                        particle.scale.set(0);
                        particle.anchor.set(0.5);
                        particle.roundPixels = true;
                        paticleCon.current!.addChild(particle);
                        gsap.to(particle, 0.3, { alpha: randomRange(30, 100) * 0.01 });
                        gsap.to(particle, 0.6, { pixi: { scale: randomRange(50, 120) * 0.01 * arrowCon.scale.x, rotation: `+=${toRadian(randomRange(-360, 360))}`}});
                        gsap.to(particle, 1, { pixi: { x: `+=${randomRange(-50, 50)}`, y: `+=${randomRange(-50, 50)}`}});
                        gsap.to(particle, 0.3, { delay: randomRange(400, 800)* 0.001, alpha: 0, onComplete: () => {
                           try{
                              particle.destroy();
                           } catch(e){}
                        }});
                     }
                  }
               });
            }
            if(this.progress() > 0.65) {
               rope.texture = resources.mainBlurScratch.texture;
            }
         },
         onComplete: () => {
            try{
               rope.destroy();
            }catch(e){}
         },
         ease: Cubic.easeInOut
      });
      gsap.to(arrowCon, 0.5, { rotation: -toRadian(50),  ease: Power2.easeInOut });
      gsap.to(arrowCon, 0.2, { delay: 0.7, rotation: toRadian(80),  ease: Power2.easeOut });
      gsap.to(arrowCon, 1, { pixi: {scale: 0.5}, ease: Cubic.easeIn });
      gsap.to(arrowCon, 0.2, {delay:1.8, pixi: {alpha: 0}});
      timer.current = PIXITimeout.start(() => {
         resources.audioArrowShoot.sound.play();
         wrongList.forEach((idx, i) => {
            timer.current = PIXITimeout.start(() => onShootBonus(idx, hitPositions[idx], i === wrongList.length - 1), idx * 200);
         })
      }, 200);
   },[wordLists]);


   useImperativeHandle(ref, () => ({

      start: (wordList, correctWord) => {
         setWordLists(wordList);
         setCorrectWords(correctWord);
      },

      finish: ( delay ) => {
         disableShooter();
         gsap.to(container.current, 0.3, {delay: delay * 0.001, pixi: {alpha: 0}});
      },

      shootBonus1: () => {
         disableShooter();
         timer.current = PIXITimeout.start(()=>{
            clearArrows();
            app.stage.getChildByName('shootTargetCam', true).zIndex = 0;
            container.current!.zIndex = 1;
            shootCon.current!.position.x = 1024;
            if(step > 1) {
               setArrows([{id: `shootArrowBonusCon`}]);
            } else {
               setArrows([{id: `shootArrowBonusCon1`}, {id: `shootArrowBonusCon2`}]);
            }
            setCanBonusShoot1(true);
         }, 1500);  
      },

      shootBonus2: () => {
         disableShooter();
         timer.current = PIXITimeout.start(()=>{
            clearArrows();
            app.stage.getChildByName('shootTargetCam', true).zIndex = 0;
            container.current!.zIndex = 1;
            shootCon.current!.position.x = 1024;
            setArrows([{id: `shootArrowBonusCon`}]);
            setCanBonusShoot2(true);
         }, 1500);
      },

      disable: () => {
         disableShooter();
         timer.current = PIXITimeout.start(()=>{
            clearArrows();
            app.stage.getChildByName('shootTargetCam', true).zIndex = 0;
            container.current!.zIndex = 1;
         }, 1500);
      }
   }));


   useEffect(() => {
      if(canShoot) {
         isShoot.current = false;
         const arrowCon = currentArrow();
         if(arrowCon && arrowCon.children.length === 0){
            const arrow = new PIXISprite3d(resources.mainShootArrow.texture);
            arrow.anchor.x = 0.5;
            arrow.roundPixels = true;
            arrowCon.addChild(arrow);
            arrowCon.position3d.x = shootCon.current!.position.x - 1024;
            arrowCon.position3d.y = 905;
            
            if(isTouch.current) {
               fullArrow();
            }

            timer.current = PIXITimeout.start(() => {
               aimPoint.current!.show();
               const hit = checkHitTarget(shootCon.current!.position.x);
               aimPoint.current!.moveTo(hit.x+1024, hit.num === -1 ? false: true);
               if(!isShowArrow.current) {
                  fullArrow(true);
                  isShowArrow.current = true;
               }
            }, isShowArrow.current ? 1 : 600);
         }
      }
   }, [canShoot]);


   useEffect(() => {
      if( canBonusShoot1 ) {
         shootArrows.current.forEach(arrowCon => {
            if(arrowCon && arrowCon.children.length === 0){
               const arrow = new PIXISprite3d(resources.mainBonusArrow.texture);
               arrow.anchor.x = 0.5;
               arrow.roundPixels = true;
               arrowCon.position3d.x = shootCon.current!.position.x - 1024;
               arrowCon.position3d.y = 905;
               arrowCon.addChild(arrow);
            }
         });
         timer.current = PIXITimeout.start(() => {
            const update = () => {
               shootArrows.current.forEach(arrowCon => {
                  arrowCon.position3d.y = 905 + (curvePoint.current.value * 0.7);
               });
               drawShootLine(curvePoint.current.value);
            }
            
            gsap.to(curvePoint.current!, 0.6, {value: 25, onUpdate: update, onComplete: ()=> {
               gsap.to(curvePoint.current!, 1, { value: 0, ease: Elastic.easeOut.config(3),
                  onUpdate: () => {
                     drawShootLine(curvePoint.current.value);
                  }
               });
               bonusEffect1();
            }});
            setCanBonusShoot1(false);
         }, 1000);
      }
   }, [canBonusShoot1]);


   useEffect(() => {
      if( canBonusShoot2 ) {
         const arrowCon = shootArrows.current[0] as PIXIContainer;
         const arrow = new PIXISprite(resources.mainBonusArrow.texture);
         arrow.anchor.set(0.5);
         arrowCon.position.x = shootCon.current!.position.x - 1024;
         arrowCon.position.y = 970;
         arrow.roundPixels = true;
         arrowCon.addChild(arrow);
         timer.current = PIXITimeout.start(() => {
            const update = () => {
               shootArrows.current.forEach(arrowCon => {
                  arrowCon.position.y = 970 + (curvePoint.current.value * 0.7);
               });
               drawShootLine(curvePoint.current.value);
            }
            
            gsap.to(curvePoint.current!, 0.6, {value: 25, onUpdate: update, onComplete: ()=> {
               gsap.to(curvePoint.current!, 0.5, {value: 0, ease: Elastic.easeInOut.config(3),
                  onUpdate: () => {
                     drawShootLine(curvePoint.current.value);
                  }
               });
               bonusEffect2();
            }});
            setCanBonusShoot2(false);
         }, 590);
      }
   }, [canBonusShoot2]);


   useEffect(() => {
      if(correctWords.length > 0) {
         isShowArrow.current = false;
         correctIndex.current=[];
         curvePoint.current.value = 0;
         clearArrows();
         makeArrow(0);
         app.stage.getChildByName('shootTargetCam', true).zIndex = 0;
         container.current!.zIndex = 1;
         shootCon.current!.position.x = 1024;
         gsap.set(container.current, {
            pixi: {alpha:1, y: 150}
         });
         gsap.to(container.current, 0.3, {
            delay:0.5, 
            pixi: { y: 0, alpha: 1 }, 
            ease: Power3.easeOut, 
            onStart: ()=>{
               container.current!.interactiveChildren= true;
               app.stage.interactive = true;
               app.stage.on('pointermove', onTouchMove);
            }
         });
      }
   }, [correctWords]);


   useEffect(() => {
      drawShootLine(0);
      return () => {
         app.stage.interactive = false;
         app.stage.off('pointermove');
         PIXITimeout.clear(timer.current);
      }
   }, []);


   return (
      <>
         <Container 
            ref={container}
            y={container.current ? container.current.position.y : 150}
            interactiveChildren={container.current ? container.current.interactiveChildren : false}
            {...props}>
            <Container 
               ref={shootCon}
               name="shooterCon" 
               position={shootCon.current ? shootCon.current.position : [1024, 985]}
               anchor={0.5}>
               <Graphics 
                  ref={shootLine}
                  name="shootLine"
                  cacheAsBitmap={true}
                  y={27}
                  anchor={0.5} />
               <Sprite 
                  name="shootStick"
                  anchor={0.5}
                  roundPixels={true}
                  texture={resources.mainShootStick.texture} />
               <Sprite
                  name="shootBtn"
                  anchor={0.5}
                  width={2048}
                  height={400}
                  texture={Texture.EMPTY}
                  interactive={true}
                  buttonMode={true}
                  pointerdown={onTouchStart}
                  pointerup={onTouchEnd}
                  pointerupoutside={onTouchEnd} />
            </Container>
            <Camera3d 
               position={[1024, 0]}
               setPlanes={[5000, 10, 10000]}>
               {arrows && arrows.map((arrow, i) => (
                  <Container3d
                     ref={(ref: PIXIContainer3d) => ref && (shootArrows.current[i] = ref)}
                     key={arrow.id} 
                     name={arrow.id}
                     anchor={[0.5, 1]} />
               ))}
            </Camera3d>
         </Container>

         <Camera3d 
            position={[1024, 0]}
            setPlanes={[5000, 10, 10000]}
            zIndex={3}>
            <Container3d ref={paticleCon} name="paticleCon" />
         </Camera3d>

         <AimPoint ref={aimPoint}zIndex={2} y={670} />
      </>
   );
})

export default memo(Shooter);