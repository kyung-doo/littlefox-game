import { FC, useCallback, useEffect, useState } from "react";
import GameLayout from "../layouts/GameLayout";
import { Provider } from "react-redux";
import Store from '../stores/game';
import useAssets from "../hooks/useAssets";
import { GameActions, GameStatus } from "../stores/game/reducer";
import GameIntro from "../componens/game/letter-teams/GameIntro";
import Loading from "../componens/game/Loading";
import GameMain from "../componens/game/letter-teams/GameMain";
import PixiButton from "../componens/game/PixiButton";
import { isMobile } from "../utils";
import GameResult from "../componens/game/letter-teams/GameResult";




/*
* @ PROPS
*     stage: 게임 스테이지
*     step: 게임 스텝
*/
interface Props {
   stage: string | null;   
}



const LetterTeamsGame: FC<Props> = ({ stage }) => {

   const dispatch = Store.dispatch;
   const [status, setStatus] = useState<GameStatus>(GameStatus.INIT);
   const [gameData, setGameData] = useState<any>(null);
   const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
   const [resultData, setResultData] = useState<any>(null);

   const { resources, loadStart, loadComplete } = useAssets();
   const [resultPopupData, setResultPopupData] = useState<any>(null);
   



   const onDataLoaded = useCallback(( gameData: any) => {
      dispatch({type: GameActions.INIT, payload: { 
         gameData: gameData, 
         stage: stage ? parseInt(stage) : 1, 
      }});

      const assetsList = require('../assets/LetterTeamsGameAssets').default( gameData.langCode, gameData.lowQuality );

      gameData.quizList.forEach((li: any, i: number) => {
         assetsList.push({ name: `quizAudio${i}`, url: li.words.audio, noRequired: true });
      });
      
      loadStart(assetsList);
   },[]);


   const onCloseResultPopup = useCallback(() => {
      dispatch({type: GameActions.SHOW_RESULT_POPUP, payload: false });
   }, []);
   

   const onExitApp = useCallback(( e ) => {
      window.self.close();
      console.log('ExitApp');
   }, []);

   useEffect(() => {
      if(showResultPopup){
         const data: any = [];
         gameData.quizList.forEach((list: any, i: number) => {
            const result = resultData.filter((x: any) => x.listNo === i);
            data.push({
               no: i,
               text: list.words.text,
               sound: resources![`quizAudio${i}`].sound,
               corrects: result.map((x: any) => x.correct).sort().reverse()
            })
         });
         setResultPopupData(data);
      } else {
         if(resources) resources.audioClick.sound.play();
         setResultPopupData(null);
      }
   },[showResultPopup]);

   
   useEffect(() => {
      if( resources ) {
         console.log('resources : ', resources);
         dispatch({type: GameActions.CHANGE_STATUS, payload: GameStatus.INTRO});
      }
   }, [resources]);
   

   useEffect(() => {
      Store.subscribe(() => {
         const state = Store.getState();
         switch(state.action.type) {
            case GameActions.INIT : setGameData(state.root.gameData); break;
            case GameActions.CHANGE_STATUS : 
               setStatus(state.root.status); 
               if(state.root.status === GameStatus.RESULT) {
                  setResultData(state.root.resultData);
               }
            break;
            case GameActions.SHOW_RESULT_POPUP : setShowResultPopup(state.root.showResultPopup); break;
            case GameActions.RESET : setResultData(null); break;
         }
      });
   }, []);


   return (
      <div id="wrap">
         <GameLayout 
            type="LetterTeams"
            title='Balloon Ride'
            stage={stage ? parseInt(stage) : 1}
            resultPopupData={resultPopupData}
            onLoaded={onDataLoaded}
            onCloseResultPopup={onCloseResultPopup}>
            <Provider store={Store}>
               {(loadComplete && resources) 
                  ?
                  <>
                     {status === GameStatus.INTRO && 
                        <GameIntro />
                     }

                     {status === GameStatus.GAME_START && 
                        <GameMain />
                     }

                     {status === GameStatus.RESULT && 
                        <GameResult />
                     }

                     <PixiButton 
                        name="exitBtn" 
                        anchor={[1, 0]}
                        scale={isMobile() ? 1.5 : 1}
                        position={[2008, 29]}
                        defaultTexture={resources.commonExitBtn.texture!}
                        sound={resources.audioClick.sound}
                        onTouchEnd={onExitApp}
                        align="RIGHT" />
                  </>
                  :
                  <Loading bgUrl='images/game/letter-teams/intro/bg.png' />
               }
            </Provider>
         </GameLayout>
      </div>
   )
}

export default LetterTeamsGame;