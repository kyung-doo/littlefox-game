

export enum GameStatus {
   INIT = 'INIT',
   INTRO = 'INTRO',
   GAME_START = 'GAME_START',
   RESET = 'RESET',
   RESULT = 'RESULT'
}


export enum GameActions {
   INIT = 'INIT',
   CHANGE_STATUS = 'CHANGE_STATUS',
   CORRECT_SCORE = 'CORRECT_SCORE',
   INCORRECT_SCORE = 'INCORRECT_SCORE',
   BONUS_SCORE = 'BONUS_SCORE',
   ADD_BONUS_COUNT = 'ADD_BONUS_COUNT',
   ADD_BONUS_LENGTH = 'ADD_BONUS_LENGTH',
   NEXT_QUIZ = 'NEXT_QUIZ',
   ADD_QUIZ_COUNT = 'ADD_QUIZ_COUNT',
   ADD_RESULT = 'ADD_RESULT',
   SET_BEST_SCORE = 'SET_BEST_SCORE',
   SHOW_RESULT_POPUP = 'SHOW_RESULT_POPUP',
   RESTART = 'RESTART',
   RESET = 'RESET'
}

export type ActionTypes = {
   type: string;
   payload: any;
}

export type StateTypes = {
   status: GameStatus,  // 게임 상태
   stage: number; // 게임 스테이지
   step: number;  // 게임 스텝
   quizCount: number;   // 문제 출제한 카운트
   score: {
      correct: number; // 정답 스코어
      incorrect: number;  // 오답 스코어
      bonus: number;  // 보너스 스코어
      total: number; // 전체 스코어
   };
   bonusCount: number;  // 보너스를 부여할 카운트
   bonusLength: number; // 보너스가 발동한 카운트 
   gameData: any[] | null; // api 게임 데이터
   resultData: Array<{ listNo: number, correct: any }>; // 결과 데이터
   showResultPopup: boolean; // 결과팝업을 호출 유무
   bestScore: {
      score: number; // 최고 스코어 점수
      date: string; // 최고 스코어 날짜
   }
}

export const InitialState: StateTypes = {
   status: GameStatus.INIT, 
   stage: 1,
   step: 1,
   quizCount: 0,
   score: { correct: 0, incorrect: 0, bonus: 0, total: 0 },
   bonusCount: 0,
   bonusLength: 0,
   gameData: null,
   showResultPopup: false,
   resultData: [],
   bestScore: {
      score: 0,
      date: ''
   }
}

export const Reducer = ( state: StateTypes = InitialState, action: ActionTypes ) => {
   switch( action.type ) {
      case GameActions.INIT :
         return {...state, ...action.payload };
      case GameActions.CHANGE_STATUS :
         return {...state, status: action.payload };
      case GameActions.CORRECT_SCORE :
         var score = {...state.score};
         score.correct = score.correct + action.payload;
         score.total = score.total + action.payload;
         return {...state, score: score};
      case GameActions.INCORRECT_SCORE :
         var score = {...state.score};
         score.incorrect = score.incorrect + action.payload;
         score.total = score.total - action.payload;
         return {...state, score: score};
      case GameActions.BONUS_SCORE :
         var score = {...state.score};
         score.bonus = score.bonus + action.payload;
         score.total = score.total + action.payload;
         return {...state, score: score};
      case GameActions.ADD_BONUS_COUNT :
         var bonusCount = state.bonusCount;
         bonusCount = bonusCount + 1;
         return {...state, bonusCount: bonusCount};
      case GameActions.ADD_BONUS_LENGTH :
         var bonusLength = state.bonusLength;
         bonusLength = bonusLength + 1;
         return {...state, bonusCount: 0, bonusLength: bonusLength};
      case GameActions.NEXT_QUIZ :
         return {
            ...state, 
            resultData: [...state.resultData, action.payload], 
            quizCount: state.quizCount+1
         };
      case GameActions.ADD_QUIZ_COUNT :
         return {
            ...state, 
            quizCount: state.quizCount+1
         };
      case GameActions.SET_BEST_SCORE :
         return {
            ...state, 
            bestScore: action.payload
         };
      case GameActions.ADD_RESULT :
         return {
            ...state, 
            resultData: [...state.resultData, action.payload], 
         };
      case GameActions.SHOW_RESULT_POPUP :
         return { ...state, showResultPopup: action.payload };
      case GameActions.RESET : 
         return { 
            ...state, 
            quizCount: 0, 
            bonusCount: 0,
            bonusLength: 0,
            score: { correct: 0, incorrect: 0, bonus: 0, total: 0 }, 
            resultData: []
         };
      default : 
         return state;
   }
}
