import { FC, useCallback, useEffect, useState, useRef } from 'react';
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from '../stores/study';
import { StudyActions, StudyStatus } from '../stores/study/reducer';
import StudyLayout from '../layouts/StudyLayout';
import AudioButton, { Refs as AudioButtonRefs } from '../componens/study/AudioButton';
import { addClass, removeClass } from '../utils';
import LetterTeamsQuiz from '../componens/study/LetterTeamsQuiz';
import { Sound } from '@pixi/sound';

import '../assets/scss/study-common.scss';
import '../assets/scss/study-letter-teams.scss';



enum QuizStatus {
   INIT = 'INIT',
   INTRO = 'INTRO',
   START = 'START'
}


const Study: FC<{idx: number, stage: number}> = ({ idx, stage }) => {
   
   const dispatch = useDispatch();
   const studyData: any = useSelector<any>(state => state.studyData);
   const status: any = useSelector<any>(state => state.status);
   const activeIndex: any = useSelector<any>(state => state.activeIndex);
   const data = studyData.list[idx-1];

   const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.INIT);
   const audioBtn = useRef<AudioButtonRefs>(null);
   const syllableBox = useRef<HTMLDivElement[]>([]);
   const wordsAudio = useRef<Sound>();
   const audios = useRef<Sound[]>([]);
   const timer = useRef<any>();

   const audioFinish = useCallback(( idx: number ) => {
      const isSilent = data.syllables.findIndex((syllable: any) => syllable.isSilent);
      const withSilent = data.syllables.findIndex((syllable: any) => syllable.withSilient);
      const length = isSilent > -1 ? data.syllables.length -1 : data.syllables.length;

      if(idx <= length) {
         syllableBox.current.forEach(syllable => removeClass(syllable, 'playing'));
         timer.current = setTimeout(() => {   
            if(idx == length){
               wordsAudio.current!.play(() => audioFinish(idx+1));
               syllableBox.current.forEach(syllable => addClass(syllable, 'playing'));
            } else {
               if(idx === withSilent) {
                  audios.current[idx].play(() => audioFinish(idx + 1));
                  addClass(syllableBox.current[idx], 'playing');
                  addClass(syllableBox.current[isSilent], 'playing');
               } else {
                  audios.current[idx].play(() => audioFinish(idx + 1));
                  addClass(syllableBox.current[idx], 'playing');
               }
            }
         }, 100);
      } else {
         syllableBox.current.forEach(syllable => removeClass(syllable, 'playing'));
         setQuizStatus(QuizStatus.START);
      }
   }, [quizStatus, syllableBox.current]);

   const onStudyClear = useCallback(() => {
      dispatch({ 
         type: StudyActions.CHANGE_STATUS, 
         payload: StudyStatus.STUDY_END
      });
   }, []);

   const stopAudio = () => {
      audios.current.forEach(audio => audio.stop());
   }
   

   useEffect(() => {
      if(status === StudyStatus.STUDY_START) {
         clearTimeout(timer.current);
         if(idx === activeIndex + 1){
            timer.current = setTimeout(()=>{
               setQuizStatus(QuizStatus.INTRO);
            }, 500);
         } else {
            setQuizStatus(QuizStatus.INIT);
            stopAudio();
            syllableBox.current.forEach( box => {
               removeClass(box, 'playing');
               removeClass(box, 'active');
               removeClass(box, 'clear');
            });
         }
      } else if(status === StudyStatus.STUDY_TRANSITION || status === StudyStatus.RESULT) {
         clearTimeout(timer.current);
         stopAudio();
      }
   }, [status]);

   useEffect(() => {
      if(quizStatus === QuizStatus.INTRO) {
         timer.current = setTimeout(()=>{
            audios.current[0].play(() => audioFinish(1));
            addClass(syllableBox.current[0], 'playing');
         }, 500);
      }
   }, [quizStatus]);

   useEffect(() => {
      wordsAudio.current = Sound.from({url: data.words.audio, preload: true}); 
      data.syllables.forEach((syllable: any, i: number) => {
         if(syllable.audio) {
            audios.current[i] = Sound.from({url: syllable.audio, preload: true});
         }
      });
   },[]);
   

   return (
      <>
         <div className="quiz-view">
            <div className="syllable-boxs">
               {data.syllables.map((syllable: any, i: number) => (
                  <div ref={ref => ref && (syllableBox.current[i] = ref)}
                     className={`syllable-box ${syllable.isTarget ? 'target' : ''}`}
                     style={{letterSpacing: syllable.text.length === 3 ? '-5px' : '0px'}}
                     key={`word-${i}`}>
                     {syllable.text}
                  </div>
               ))}
            </div>
            <AudioButton
               ref={audioBtn}
               left="14px"
               top="11px"
               src={data.words.audio} 
               disabled={
                  quizStatus === QuizStatus.INIT || 
                  quizStatus === QuizStatus.INTRO
               } />  
         </div>
         { quizStatus === QuizStatus.START && 
            <LetterTeamsQuiz
               syllables={data.syllables}
               syllableBox={syllableBox.current}
               onStudyClear={onStudyClear}
               audioStop={() => audioBtn.current?.stop()} />
         }
      </>
   )
}


const LetterTeamsStudy: FC<{stage: string | null}> = ({stage}) => {
   return (
      <div id="wrap">
         <Provider store={Store}>
            <StudyLayout 
               title="Balloon Ride"
               type="LetterTeams"
               stage={stage ? parseInt(stage) : 1}
               showGameBtn={true}
               studyElem={idx => <Study idx={idx} stage={stage ? parseInt(stage) : 1} />} />
         </Provider>
      </div>
   )
}

export default LetterTeamsStudy;