import { VFC, memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { Sound } from '@pixi/sound';
import { gsap, Back} from 'gsap';
import { isMobile } from '../../utils';



/*
* @ PROPS
*     data: 결과 데이터
*     type: 게임 타입 ( Alphabet | Phonics | Words )
*     step: 게임 스텝
*     onClose: 팝업 close 콜백
*/
export interface Props {
   data: {[key: string]: any}[];
   type: string;
   step: number;
   onClose: () => void;
}


const ResultPopup: VFC<Props> = ({ data, type, step, onClose }) => {

   const popWrap = useRef<HTMLDivElement>(null);
   const blind = useRef<HTMLDivElement>(null);

   const onPlayeSound = useCallback(( sound: Sound ) => {
      data.forEach(x => x.sound.stop());
      sound.play();
   },[data]);

   const withImage = useMemo<boolean>(() => {
      if(type === 'Alphabet') {
         if(step === 3) return true;
         else           return false;
      } else if(type === 'LetterTeams') {
         return false;
      } else if(type === 'SightWords') {
         return false;
      } else {
         return true;
      }
   },[]);

   useEffect(() => {
      popWrap.current!.style.display = 'block';
      blind.current!.style.display = 'block';
      gsap.from(popWrap.current, 0.8, { y: 1500, ease: Back.easeOut.config(1), force3D: true });
      gsap.from(blind.current, 0.3, { opacity: 0});
   },[]);
   

   return (
      <div id="result-popup" className={`${type.toLowerCase()}${step} ${isMobile() ? 'mobile' : 'pc'}`}>
         <div ref={blind} className="blind" onClick={onClose} style={{display: 'none'}}></div>
         <div ref={popWrap} className="popup-wrap" style={{display: 'none'}}>
            <div className="top-title">
               <img src={require('../../assets/images/game/common/result_popup_title.png').default} height="56" />
            </div>
            <button className="close-btn" onClick={onClose}></button>
            <div className="list-wrap">
               <div className="list-header">
                  <div><img src={require('../../assets/images/game/common/words_text.png').default} height="23" /></div>
                  {type === 'LetterTeams' || type === 'SightWords'
                     ?
                     <div>
                        <div className="top">
                           <img src={require('../../assets/images/game/common/my_result_text.png').default} height="30" />
                        </div>
                        <div className="bottom">
                           <div><img src={require('../../assets/images/game/common/my_result_o.png').default} height="22" /></div>
                           <div><img src={require('../../assets/images/game/common/my_result_x.png').default} height="22" /></div>
                        </div>
                     </div>
                     :
                     <div><img src={require('../../assets/images/game/common/my_result_text.png').default} height="30" /></div>
                  }
               </div>
               <div className="list-body">
                  {data.map((list, i) => (
                     <div key={`result-list-${i}`} className="list">
                        <div className="words">
                           <button className="speaker-btn" onClick={() => onPlayeSound(list.sound)}></button>
                           {type === 'Alphabet' 
                              ?
                              <>
                                 <div className="text" style={{fontSize: '38px'}}>{list.text}</div>
                                 {withImage &&
                                    <div className="image"><img src={list.image} /></div>
                                 }
                              </>
                              :
                              <>
                                 {withImage &&
                                    <div className="image"><img src={list.image} /></div>
                                 }
                                 <div 
                                    className="text"
                                    style={{
                                       fontSize: list.text.length > 12 ? `${35 - (list.text.length - 12)}px` : '38px'
                                    }}>
                                    {list.text}
                                 </div>
                              </>
                           }
                        </div>
                        {type === 'LetterTeams' || type === 'SightWords'?
                           <div className="result">
                              <div>
                                 {list.corrects.filter((x: boolean) => x).length}
                              </div>
                              <div>
                                 {list.corrects.filter((x: boolean) => !x).length}
                              </div>
                           </div>
                           :
                           <div className="result">
                              {Array.from(Array(Math.ceil(list.corrects.length/10)), (n, j) => (
                                 <div key={`hart-group-${i}-${j}`} className="hart-group">
                                    {Array.from(Array(10), (n, k)=> {
                                       const num = k + 10 * j;
                                       if(num < list.corrects.length) {
                                          return (
                                             <span key={`hart-${i}-${num}`} className={`hart ${list.corrects[num] ? 'on' : 'off'}`}></span>
                                          )
                                       }
                                    })}   
                                 </div>
                              ))}
                           </div>
                        }
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}

export default memo(ResultPopup);