import { Ticker } from "pixi.js";

/*
*  PIXI용 setTimeout
*      const timer = PIXITimeout.start(() => {}, 1000);
*       PIXITiemout.clear(timer);
*      
*/

export class PIXITimeoutContext {

   public progress: number = 0;
   
   constructor ( 
      public ticker: Ticker, 
      public delay: number, 
      public callback: () => void 
   ) {}

   public tick ( delta: number ) {
      this.progress += delta;
      let end = (this.progress / (60 * this.ticker.speed)) * 1000;
      if (end > this.delay) this.callback();
   }
}


export default class PIXITimeout {
   
   public static ticker: Ticker;

   public static register ( ticker: Ticker ) {
      PIXITimeout.ticker = ticker;
   }

   public static start ( callback: () => void, delay: number = 0 ) {
      const ctx = new PIXITimeoutContext(PIXITimeout.ticker, delay, () => {
         PIXITimeout.clear(ctx);
         callback();
      });
      PIXITimeout.ticker.add(ctx.tick, ctx);
      return ctx;
   }

   public static clear (ctx: PIXITimeoutContext) {
      if(ctx) {
         PIXITimeout.ticker.remove(ctx.tick, ctx);
      }
   }
}
