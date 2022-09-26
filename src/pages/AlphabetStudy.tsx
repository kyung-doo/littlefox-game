import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from '../stores/study';
import { StudyActions, StudyStatus } from '../stores/study/reducer';
import StudyLayout from '../layouts/StudyLayout';
import AudioButton, { Refs as AudioButtonRefs } from '../componens/study/AudioButton';
import AlphabetQuiz from '../componens/study/AlphabetQuiz';
import { Sound } from '@pixi/sound';

import '../assets/scss/study-common.scss';
import '../assets/scss/study-alphabet.scss';



enum QuizStatus {
   INIT = 'INIT',
   INTRO = 'INTRO',
   START = 'START'
}


const Study: FC<{idx: number}> = ({ idx }) => {
   
   const dispatch = useDispatch();
   const studyData: any = useSelector<any>(state => state.studyData);
   const status: any = useSelector<any>(state => state.status);
   const activeIndex: any = useSelector<any>(state => state.activeIndex);
   const data = studyData.list[idx-1];

   const [quizStatus, setQuizStatus] = useState<QuizStatus>(QuizStatus.INIT);
   const audios = useRef<Sound[]>([]);
   const audioBtns = useRef<AudioButtonRefs[]>([]);
   const audioBeforeClick = () => audioBtns.current.forEach(btn => btn.stop());
   const [viewActives, setViewActives] = useState<{[key:string] : boolean}>({ left: false, right: false });
   const timer = useRef<any>();


   const audioFinish1 = useCallback(() => {
      timer.current = setTimeout(() => {
         setViewActives( prevState => ({...prevState, right: true}));
         audios.current[1].play(audioFinish2);
      }, 100);
      setViewActives( prevState => ({...prevState, left: false}));
   }, []);

   const audioFinish2 = useCallback(() => {
      setQuizStatus(QuizStatus.START);
      setViewActives( prevState => ({...prevState, right: false}));
   }, []);

   const onStudyClear = useCallback(() => {
      dispatch({ 
         type: StudyActions.CHANGE_STATUS, 
         payload: StudyStatus.STUDY_END
      });
   }, []);

   const stopAudio = useCallback(() => {
      audios.current.forEach(audio => audio.stop());
   }, []);

   useEffect(() => {
      if(status === StudyStatus.STUDY_START) {
         clearTimeout(timer.current);
         if(idx === activeIndex + 1) {
            setViewActives({left: false, right: false});
            timer.current = setTimeout(() => {
               setQuizStatus(QuizStatus.INTRO);
            }, 500);
         } else {
            setQuizStatus(QuizStatus.INIT);
            stopAudio();
         }
      } else if(status === StudyStatus.STUDY_TRANSITION || status === StudyStatus.RESULT) {
         clearTimeout(timer.current);
         stopAudio();
      }
   }, [status]);


   useEffect(() => {
      if(quizStatus === QuizStatus.INTRO) {
         timer.current = setTimeout(()=>{
            audios.current[0].play(audioFinish1);
            setViewActives( prevState => ({...prevState, left: true}));
         }, 500);
      }
   }, [quizStatus]);
   

   useEffect(() => {
      audios.current[0] = Sound.from({url: data.audio1, preload: true});
      audios.current[1] = Sound.from({url: data.audio2, preload: true});
   }, []);
   

   return (
      <>
         <div className={`quiz-view left ${viewActives.left ? 'active': ''}`}>
            <div className="view-wrap">
               <div className="image"><img src={data.image} /></div>
               <AudioButton 
                  ref={ref => ref && (audioBtns.current[0] = ref)}
                  src={data.audio1} 
                  left="42px"
                  top="30px"
                  onBeforeClick={audioBeforeClick}
                  disabled={
                     quizStatus === QuizStatus.INIT || 
                     quizStatus === QuizStatus.INTRO
                  } />  
            </div>
         </div>
         <div className={`quiz-view right ${viewActives.right ? 'active': ''}`}>
            <div className="view-wrap">
               <div className="image"><img src={data.image2} /></div>
               <AudioButton 
                  ref={ref => ref && (audioBtns.current[1] = ref)}
                  src={data.audio2} 
                  left="42px"
                  top="30px"
                  onBeforeClick={audioBeforeClick}
                  disabled={
                     quizStatus === QuizStatus.INIT || 
                     quizStatus === QuizStatus.INTRO
                  } />
            </div>
         </div>
         { quizStatus === QuizStatus.START && 
            <AlphabetQuiz 
               alphabets={studyData.alphabets}
               correctAlphabet={data.correct}
               onStudyClear={onStudyClear}
               audioStop={audioBeforeClick} />
         }
      </>
   )
}

const AlphabetStudy: FC<{stage: string | null}> = ({stage}) => {
   return (
      <div id="wrap">
         <Provider store={Store}>
            <StudyLayout 
               title="Bubble Pop"
               type="Alphabet"
               stage={stage ? parseInt(stage) : 1}
               studyElem={idx => <Study idx={idx} />} />
         </Provider>
      </div>
   )
}

export default AlphabetStudy;