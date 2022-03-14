import { FC, useEffect, useState } from 'react';


/*
* @ PROPS
*     contentWidth: 콘텐츠 넓이
*     contentHeight: 콘텐츠 높이
*     disabled: 콘텐츠 disabled 처리
*/
export interface Props {
   contentWidth: number;
   contentHeight: number;
   disabled?: boolean;
}

const CommonLayout: FC<Props> = ({ children, contentWidth, contentHeight, disabled }) => {

   const [contentScale, setContentScale] = useState<number>(0);
   const [contentLeft, setContentLeft] = useState<number>(0);
   const [contentTop, setContentTop] = useState<number>(0);

   const resizeWindow = () => {
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      const scaleX = winWidth / contentWidth;
      const scaleY = winHeight / contentHeight;
      const scale = Math.min(scaleX, scaleY);
      setContentScale(scale);
      setContentLeft((winWidth-(contentWidth*scale))/2);
      setContentTop((winHeight-(contentHeight*scale))/2);
      window.scale = scale;
   }

   useEffect(() => {
      window.addEventListener('resize', resizeWindow);
      window.dispatchEvent(new Event('resize'));
      window.addEventListener('orientationchange', () => setTimeout(resizeWindow, 100));
   }, []);

   return (
      <div id="container" 
         style={{
            height: `${contentHeight * contentScale + contentTop}px`,
            pointerEvents: `${disabled ? 'none' : 'all'}`
         }}>
         <div id="content-wrap" 
            style={{
               left: `${contentLeft}px`,
               top: `${contentTop}px`,
               width: `${contentWidth}px`,
               height: `${contentHeight}px`,
               transform: `scale(${contentScale}, ${contentScale})`
            }}>
            { children }
         </div>
      </div>
   )
}

export default CommonLayout;