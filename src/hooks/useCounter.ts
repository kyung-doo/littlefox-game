import { useCallback } from 'react';
import { useRef } from 'react';

const now = () => {
   return (new Date()).getTime();
}
const pad = (num: number, size: number) => {
   var s = "0000" + num;
  return s.substr(s.length - size);
}

const useCounter = ( length: number = 0 ) => {
   const startAt = useRef<number>(0);
   const lapTime = useRef<number>(0);
   const isCount = useRef<boolean>(false);

   const onVisibleChange = useCallback(( e ) => {
      if(document.hidden) {
         if(isCount.current) pause();
      } else {
         if(isCount.current) start();
      }
   }, []);

   const start = useCallback(()=>{
      startAt.current = startAt.current ? startAt.current : now();
      isCount.current = true;
      document.removeEventListener('visibilitychange', onVisibleChange);
      document.addEventListener('visibilitychange', onVisibleChange);
   }, []);

   const pause = useCallback(()=>{
      lapTime.current = startAt.current ? lapTime.current + now() - startAt.current : lapTime.current;
      startAt.current = 0;
   }, []);

   const reset = useCallback(() => {
      lapTime.current = 0;
      startAt.current = 0;
      isCount.current = false;
      document.removeEventListener('visibilitychange', onVisibleChange);
   }, []);

   const getTime = useCallback(() => {
      return lapTime.current + (startAt.current ? now() - startAt.current : 0);
   }, []);

   const getFormat = useCallback(() => {
      let time = length - getTime();
      let m = 0; 
      let s = 0;
      m = Math.floor( time / (60 * 1000) );
      time = time % (60 * 1000);
      s = Math.floor( time / 1000 );
      if(m < 0) m = 0;
      if(s < 0) s = 0;
      return pad(m, 2)+":"+pad(s, 2);
   }, []);

   return {
      start,
      pause,
      reset,
      getTime,
      getFormat
   }
}

export default useCounter;