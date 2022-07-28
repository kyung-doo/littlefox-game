
const fontPath = 'fonts/';
const audioPath = 'audio/';
const commonImgPath = 'images/game/common/';
const introImgPath = 'images/game/letter-teams/intro/';
const mainImgPath = 'images/game/letter-teams/main/';
const resultImgPath = 'images/game/letter-teams/result/';
const spritesheetPath = 'images/game/letter-teams/spritesheet/';




export default ( step: number, langCode: string, low: number ) => {


   const resource = [

      //common
      { name: 'LexendDeca-Light', url: `${fontPath}LexendDeca-Light.ttf`},
      { name: 'LexendDeca-Regular', url: `${fontPath}LexendDeca-Regular.ttf`},
      { name: 'LexendDeca-Bold', url: `${fontPath}LexendDeca-Bold.ttf`},
      { name: 'Maplestory Bold', url: `${fontPath}Maplestory Bold.ttf`},
      { name: 'audioBgm', url: `${audioPath}bgm_alphabet.mp3` },
      { name: 'audioClick', url: `${audioPath}click.mp3` },
      { name: 'audioBubbleStart', url: `${audioPath}bubble_start.mp3` },
      { name: 'audioBubblePop', url: `${audioPath}bubble_pop.mp3` },
      { name: 'audioCorrect', url: `${audioPath}correct.mp3` },
      { name: 'audioWrong', url: `${audioPath}wrong.mp3` },
      { name: 'audioBonus', url: `${audioPath}bonus.mp3` },
      { name: 'audioGameover', url: `${audioPath}game_over.mp3` },
      { name: 'commonExitBtn', url: `${commonImgPath}exit_btn.png` },
      
      
      
      // intro
      



      // main
      { name: 'mainPickerBg', url: `${mainImgPath}picker_bg.png` },
      { name: 'mainPickerUp', url: `${mainImgPath}picker_up.png` },
      { name: 'mainPickerDown', url: `${mainImgPath}picker_down.png` },



      // result
      
      
   ];

   
   return resource;
}
