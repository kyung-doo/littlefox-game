
export enum StudyStatus {
   INIT = 'INIT',
   READY = 'READY',
   START = 'START',
   STUDY_START = 'STUDY_START',
   STUDY_END = 'STUDY_END',
   STUDY_TRANSITION = 'STUDY_TRANSITION',
   RESULT = 'RESULT',
   RESTART = 'RESTART'
}

export enum StudyActions {
   INIT = 'INIT',
   CHANGE_STATUS = 'CHANGE_STATUS',
   SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
   SET_ACTIVE_INDEX = 'SET_ACTIVE_INDEX',
   SET_CLEAR_PAGE = 'SET_CLEAR_PAGE',
   RESTART = 'RESTART'
}

export type ActionTypes = {
   type: string;
   payload: any;
}

export type StateTypes = {
   status: StudyStatus,    // 학습 상태
   stage: number;          // 학습 스테이지
   currentPage: number;    // 현재 페이지   
   activeIndex: number;    // 현재 활성 인덱스 ( 랜덤으로 문제가 나옴으로 currentPage와 인덱스가 다름 )
   clearPages: number[];   // 완료한 페이지 배열
   totalPage: number;      // 전체 페이지 수
   studyData: any | null;  // api에서 가져온 학습 데이터
}

export const InitialState = {
   status: StudyStatus.INIT,
   stage: 1,
   currentPage: 1,
   activeIndex: 0,
   clearPages: [],
   totalPage: 0,
   studyData: null,
}

export const Reducer = ( state: StateTypes = InitialState, action: ActionTypes ) => {
   switch( action.type ) {
      case StudyActions.INIT :
         return {...state, ...action.payload };
      case StudyActions.SET_CURRENT_PAGE :
         return {...state, currentPage: action.payload};
      case StudyActions.SET_ACTIVE_INDEX :
         return {...state, activeIndex: action.payload};   
      case StudyActions.CHANGE_STATUS :
         return {...state, status: action.payload };
      case StudyActions.SET_CLEAR_PAGE :
         return {...state, clearPages: [...state.clearPages, action.payload]};
      case StudyActions.RESTART :
         return {
            ...state, 
            status: StudyStatus.RESTART, 
            currentPage: 1, 
            studyData: { ...state.studyData, reStudy: true } 
         };
      default : 
         return state; 
   }
}
