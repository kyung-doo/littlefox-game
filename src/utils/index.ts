/*
* 모바일 체크
*/
export const isMobile = () => {
   return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
}

/*
* 난수 배열 생성
*   @ params
*      randomNum: 생성할 랜덤 범위값 
*      randomNum: 반환 할 랜덤 갯수
*/
export const makeRandom = (randomNum: number , arNum: number): number[] => {
   const randomAr = new Array();
   const rand = new Array();
   const temp = new Array();
   let r,p,i;
   for(i = 0; i<randomNum; i++) {
      temp[i] = i;
   }
   for(i = 0; i<randomNum; i++) {
      r = Math.floor(Math.random() * (randomNum - i));
      p = temp[r];
      randomAr[i] = p;
      for(var j = r; j<randomNum - i- 1; j++) {
         temp[j] = temp[j + 1];
      }
   }
   for (i = 0; i < arNum; i++ ) {
      rand[i] = randomAr[i];
   }
   
   return rand;
}

/*
* 난수 배열 생성 특정 숫자가 첫번째 인덱스에 안오게
*   @ params
*      ignorefirst: 처음 제외할 숫자   
*      randomNum: 생성할 랜덤 범위값 
*      randomNum: 반환 할 랜덤 갯수
*/
export const makeRandomIgnoreFirst = ( ignorefirst: number, randomNum: number , arNum: number ): number[] => {
   let rand = makeRandom(randomNum, arNum);
   while(rand[0] === ignorefirst) rand = makeRandom(randomNum, arNum);
   return rand;
}


/*
* 범위 안에 난수 생성
*   @ params
*      low: 난수 시작 범위
*      high: 난수 종료 범위
*/
export const randomRange = (low: number, high: number): number => {
   return Math.floor(low + Math.random() * (high-low+1));
}


/*
* url 파라메터 가져오기
*   @ params
*      parameterName: 가져올 파라메터 이름
*/
export const findGetParameter = ( parameterName: string ): string | null => {
   let result = null;
   let tmp: string[] = [];
   window.location.search
       .substr(1)
       .split("&")
       .forEach(function (item) {
         tmp = item.split("=");
         if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
       });
   return result;
}


/*
* offset 좌표값 가져오기
*   @ params
*      el: 대상 엘레먼트
*/
export const offset = <T extends HTMLElement>(el: T): { top:number, left: number } => {
   var rect = el.getBoundingClientRect();
   return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
   }
}


/*
* 엘레먼트 클래스 추가
*   @ params
*      el: 대상 엘레먼트
*/
export const addClass = <T>(el: T, cl: string): void => {
   ((el as unknown) as Element).classList.add(cl);
}


/*
* 엘레먼트 클래스 제거
*   @ params
*      el: 대상 엘레먼트
*/
export const removeClass = <T>(el: T, cl: string): void => {
   ((el as unknown) as Element).classList.remove(cl);
}


/*
* 엘레먼트 인덱스 가져오기
*   @ params
*      el: 대상 엘레먼트
*/
export const elementIndex = ( el: Element | null | undefined ) => {
   if (!el) return -1;
   el = (el as unknown) as Element;
   let i = 0;
   while (el = el.previousElementSibling) {
     i++;
   }
   return i;
}


/*
* Radian을 Dgree로 변환
*   @ params
*      r: Radian 값
*/
export const toDegree = ( r: number): number => {
   return 180/Math.PI * r;
}

/*
* Dgree을 Radian으로 변환
*   @ params
*      d: Dgree 값
*/
export const toRadian = ( d: number): number => {
   return Math.PI * d/180;
}


/*
* 두 직선 사이의 교차점
*   @ params
*      sr : 직선 1
*      tr : 직선 2
*/
export const findCrossPoint = (
   sr: {x1: number, x2:number, y1: number, y2:number}, 
   tr: {x1: number, x2:number, y1: number, y2:number}
): {x:number, y: number} | null => {
   const p1 = (sr.x1 - sr.x2) * (tr.y1 - tr.y2) - (sr.y1-sr.y2)*(tr.x1-tr.x2);
   if(p1 != 0){
      const x = (((sr.x1 * sr.y2) - (sr.y1 * sr.x2))*(tr.x1 - tr.x2) - (sr.x1 - sr.x2) * ((tr.x1 * tr.y2) - (tr.y1 * tr.x2))) / p1; 
      const y = (((sr.x1 * sr.y2) - (sr.y1 * sr.x2))*(tr.y1 - tr.y2) - (sr.y1 - sr.y2)*((tr.x1 * tr.y2) - (tr.y1 * tr.x2))) / p1;
      if((x - tr.x1) * (x - tr.x2) <= 0 && (y - tr.y1) * (y - tr.y2) <= 0) {
         return { x : x , y : y };
      } else {
         return null;
      }
   }
   return null;
}

/*
* 두 점 사이의 거리
*   @ params
*      x1 : 시작 x
*      y1 : 시작 y
*      x2 : 끝 x
*      y2 : 끝 y
*/
export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
   return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}


/*
* 베지어 곡선
*   @ params
*      A : 시작 포인트
*      B : 곡선 포인트
*      C : 종료 포인트
*      t : 가중치 ( 0 ~ 1 )
*/
export const quadBezier = ( A: number, B: number, C: number, t: number ): number => {
   if (t === 0) return A;
   if (t === 1) return C;
   const s = 1 - t;
   return Math.pow(s, 2) * A + 2 * (s * t) * B + Math.pow(t, 2) * C;
}



/*
* 정점사이의 보간
*   @ params
*      array : 보간 할 정점 배열
*      t : 가중치 
*      tangentFactor : 탄젠트 값
*/
export const cubicInterpolation = (array: number[], t: number, tangentFactor?: number ): number => {
   if (!tangentFactor) tangentFactor = 1;
   const k = Math.floor(t);
   const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
   const p = [clipInput(k, array), clipInput(k + 1, array)];
   t -= k;
   const t2 = t * t;
   const t3 = t * t2;
   return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}
const clipInput = (k: number, array: number[]): number => {
   if (k < 0) k = 0;
   if (k > array.length - 1) k = array.length - 1;
   return array[k];
}
const getTangent = (k:number, factor: number, array: number[]): number => {
   return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
}


/*
*  숫자에 콤마 넣기
*   @ params
*      x : 숫자
*/
export const numberWithCommas = (x: number): string => {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/*
 * Cookie 값 가져오기
 *   @ params
 *       d: Cookie 값
 */
export const getCookie = ( n: string) => {
   let x, y;
   let val = document.cookie.split(';');
   for (let i = 0; i < val.length; i++) {
      x = val[i].substr(0, val[i].indexOf('='));
      y = val[i].substr(val[i].indexOf('=') + 1);
      x = x.replace(/^\s+|\s+$/g, '');
      // 앞과 뒤의 공백 제거하기
      if (x === n) {
         return unescape(y);
      }
   }
}

/**
 * 페이지 닫기 처리
 */
declare var littlefoxJavaInterface: DataInterfaceBridge;

interface DataInterfaceBridge {
   onInterfaceExitView() : any;
}

export const exitPage = () => {
   let deviceType = getCookie('device_type');
   if (deviceType === 'app') {
      let deviceOs = getCookie('device_os');
      if (deviceOs === 'android') {
         littlefoxJavaInterface.onInterfaceExitView();
      } else if (deviceOs === 'ios') {
         (window as any).webkit.messageHandlers.onInterfaceExitView.postMessage('');
      }
   }
}

window.onbeforeunload = function () {
   window.opener.window.location.href = getCookie('word_starter_game_url');
};