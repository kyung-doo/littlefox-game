
const fontPath = 'fonts/';
const audioPath = 'audio/';
const commonImgPath = 'images/game/common/';
const introImgPath = 'images/game/sight-words/intro/';
const mainImgPath = 'images/game/sight-words/main/';
const resultImgPath = 'images/game/sight-words/result/';
const spritesheetPath = 'images/game/sight-words/spritesheet/';




export default ( langCode: string, low: number ) => {


   const resource = [

      //common
      { name: 'LexendDeca-Light', url: `${fontPath}LexendDeca-Light.ttf`},
      { name: 'LexendDeca-Regular', url: `${fontPath}LexendDeca-Regular.ttf`},
      { name: 'LexendDeca-SemiBold', url: `${fontPath}LexendDeca-SemiBold.ttf`},
      { name: 'LexendDeca-Bold', url: `${fontPath}LexendDeca-Bold.ttf`},
      { name: 'Maplestory Bold', url: `${fontPath}Maplestory Bold.ttf`},
      { name: 'audioBgm', url: `${audioPath}bgm_phonics.mp3` },
      { name: 'audioClick', url: `${audioPath}click.mp3` },
      { name: 'audioCorrect', url: `${audioPath}correct.mp3` },
      { name: 'audioWrong', url: `${audioPath}wrong.mp3` },
      { name: 'audioBonus', url: `${audioPath}bonus.mp3` },
      { name: 'audioGameover', url: `${audioPath}game_over.mp3` },
      { name: 'commonExitBtn', url: `${commonImgPath}exit_btn.png` },
      
      
      
      // intro
      { name: 'commonBgmOnBtn', url: `${commonImgPath}bgm_btn_on.png` },
      { name: 'commonBgmOffBtn', url: `${commonImgPath}bgm_btn_off.png` },
      { name: 'commonBackBtn', url: `${commonImgPath}back_btn.png` },
      { name: 'introBg', url: `${introImgPath}bg.png`},
      { name: 'introInfoBtn', url: `${introImgPath}info_btn.png`},
      { name: 'introStartBtnDefault', url: `${introImgPath}start_btn_default.png`},
      { name: 'introStartBtnHover', url: `${introImgPath}start_btn_hover.png`},
      { name: 'introInfoText', url: `${introImgPath}info_text_${langCode}.png`},
      { name: 'introPannel', url: `${introImgPath}pannel.png`},
      { name: 'introTitle1_1', url: `${introImgPath}title1_1.png`},
      { name: 'introTitle1_2', url: `${introImgPath}title1_2.png`},
      { name: 'introTitle2', url: `${introImgPath}title2.png`},
      { name: 'introCharactor', url: `${introImgPath}charactor.png`},
      { name: 'introShine', url: `${introImgPath}shine.png`},
      { name: 'introLight', url: `${introImgPath}light.png`},
      { name: 'introDinos', url: `${introImgPath}dinos.png`},
      { name: 'introDinosLeg', url: `${introImgPath}dinos_leg.png`},
      { name: 'introLeaf1', url: `${introImgPath}leaf1.png`},
      { name: 'introLeaf2', url: `${introImgPath}leaf2.png`},
      { name: 'introLeaf3', url: `${introImgPath}leaf3.png`},
      { name: 'introLeaf4', url: `${introImgPath}leaf4.png`},

      

      // main
      { name: 'commonResetBtn', url: `${commonImgPath}reset_btn.png` },
      { name: 'mainBg', url: `${mainImgPath}bg.png` },



      // result
      
      
   ];

   if(low === 0) {
      
   } else {
      
   }

   
   return resource;
}
