
const fontPath = 'fonts/';
const audioPath = 'audio/';
const commonImgPath = 'images/game/common/';
const introImgPath = 'images/game/words/intro/';
const mainImgPath = 'images/game/words/main/';
const resultImgPath = 'images/game/words/result/';
const spritesheetPath = 'images/game/words/spritesheet/';





export default ( langCode: string, low: number ) => {

   const resource = [

      //common
      { name: 'LexendDeca-Light', url: `${fontPath}LexendDeca-Light.ttf`},
      { name: 'LexendDeca-Regular', url: `${fontPath}LexendDeca-Regular.ttf`},
      { name: 'LexendDeca-SemiBold', url: `${fontPath}LexendDeca-SemiBold.ttf`},
      { name: 'Maplestory Bold', url: `${fontPath}Maplestory Bold.ttf`},
      { name: 'audioBgm', url: `${audioPath}bgm_words.mp3` },
      { name: 'audioClick', url: `${audioPath}click.mp3` },
      { name: 'audioCorrect', url: `${audioPath}correct2.mp3` },
      { name: 'audioWrong', url: `${audioPath}wrong3.mp3` },
      { name: 'audioGameover', url: `${audioPath}game_over.mp3` },
      { name: 'commonExitBtn', url: `${commonImgPath}exit_btn2.png` },
      
      
      
      // intro
      { name: 'commonBgmOnBtn', url: `${commonImgPath}bgm_btn_on2.png` },
      { name: 'commonBgmOffBtn', url: `${commonImgPath}bgm_btn_off.png` },
      { name: 'commonBackBtn', url: `${commonImgPath}back_btn2.png` },
      { name: 'introBg', url: `${introImgPath}bg.png`},
      { name: 'introGuide', url: `${introImgPath}guide_img.png`},
      { name: 'introStartBtnDefault', url: `${introImgPath}start_btn_default.png`},
      { name: 'introStartBtnHover', url: `${introImgPath}start_btn_hover.png`},
      { name: 'introInfoBtn', url: `${introImgPath}info_btn.png`},
      { name: 'introMainTitle1', url: `${introImgPath}main_title1.png`},
      { name: 'introMainTitle2', url: `${introImgPath}main_title2.png`},
      { name: 'introSubTitleBg', url: `${introImgPath}sub_title_bg.png`},
      { name: 'introSubTitle1', url: `${introImgPath}sub_title_1.png`},
      { name: 'introSubTitle2', url: `${introImgPath}sub_title_2.png`},
      { name: 'introSubTitle3', url: `${introImgPath}sub_title_3.png`},
      { name: 'introSubTitle4', url: `${introImgPath}sub_title_4.png`},
      { name: 'introSubTitle5', url: `${introImgPath}sub_title_5.png`},
      { name: 'introSubTitle6', url: `${introImgPath}sub_title_6.png`},
      { name: 'introCharactor', url: `${introImgPath}charactor.png`},
      { name: 'introMusicIcon1', url: `${introImgPath}music_icon1.png`},
      { name: 'introMusicIcon2', url: `${introImgPath}music_icon2.png`},
      { name: 'introHightlight1', url: `${introImgPath}highlight1.png`},
      { name: 'introHightlight2', url: `${introImgPath}highlight2.png`},
      
      



      // main
      { name: 'commonResetBtn', url: `${commonImgPath}reset_btn2.png` },
      { name: 'mainBackParticle1', url: `${mainImgPath}back_particle1.png`},
      { name: 'mainBackParticle2', url: `${mainImgPath}back_particle2.png`},
      { name: 'mainBackParticle3', url: `${mainImgPath}back_particle3.png`},
      { name: 'mainBackParticle4', url: `${mainImgPath}back_particle4.png`},
      { name: 'mainBackParticle5', url: `${mainImgPath}back_particle5.png`},
      { name: 'mainButtonBg', url: `${mainImgPath}button_bg.png`},
      { name: 'mainButtonOff', url: `${mainImgPath}button_off.png`},
      { name: 'mainButtonOn', url: `${mainImgPath}button_on.png`},
      { name: 'mainThumbBg', url: `${mainImgPath}thumb_bg.png`},
      { name: 'mainItemLight', url: `${mainImgPath}item_light.png`},
      { name: 'mainItemLight2', url: `${mainImgPath}item_light2.png`},
      { name: 'mainScoreTitle', url: `${mainImgPath}score_title.png`},
      { name: 'mainScorePlus10', url: `${mainImgPath}score_plus_10.png`},
      { name: 'mainScorePlus100', url: `${mainImgPath}score_plus_100.png`},
      { name: 'mainScoreMinus10', url: `${mainImgPath}score_minus_10.png`},
      { name: 'mainProgressBg', url: `${mainImgPath}progress_bg.png`},
      { name: 'mainAreaLignt', url: `${mainImgPath}area_light.png`},
      { name: 'mainAreaLignt2', url: `${mainImgPath}area_light2.png`},
      { name: 'mainStartLine', url: `${mainImgPath}start_line.png`},
      { name: 'mainEffectCircle1', url: `${mainImgPath}effect_circle1.png`},
      { name: 'mainEffectCircle2', url: `${mainImgPath}effect_circle2.png`},
      { name: 'mainEffectCircle3', url: `${mainImgPath}effect_circle3.png`},
      { name: 'mainEffectStar', url: `${mainImgPath}effect_star.png`},
      { name: 'spritesheetCharactorDefault', url: `${spritesheetPath}charactor_default.json` },
      { name: 'spritesheetCharactorCorrect', url: `${spritesheetPath}charactor_correct.json` },
      { name: 'spritesheetCharactorWrong', url: `${spritesheetPath}charactor_wrong.json` },
      


      // result
      { name: 'commonResultBg', url: `${commonImgPath}result_bg.png` },
      { name: 'commonResultButtonDefault', url: `${commonImgPath}result_btn_default.png` },
      { name: 'commonResultButtonHover', url: `${commonImgPath}result_btn_hover.png` },
      { name: 'commonAgainButtonDefault', url: `${commonImgPath}again_btn_default.png` },
      { name: 'commonAgainButtonHover', url: `${commonImgPath}again_btn_hover.png` },
      { name: 'resultBg', url: `${resultImgPath}bg.png` }, 
      { name: 'resultSuccess', url: `${resultImgPath}top_img_success.png`},
      { name: 'resultFailed', url: `${resultImgPath}top_img_failed.png`},
      { name: 'resultSuccessMsg1', url: `${resultImgPath}success_message1.png`},
      { name: 'resultSuccessMsg2', url: `${resultImgPath}success_message2.png`},
      { name: 'resultSuccessMsg3', url: `${resultImgPath}success_message3.png`},
      { name: 'resultFailedMsg1', url: `${resultImgPath}failed_message1.png`},
      { name: 'resultFailedMsg2', url: `${resultImgPath}failed_message2.png`},
      { name: 'resultFailedMsg3', url: `${resultImgPath}failed_message3.png`},


   ];

   if(low === 0) {
      resource.push({ name: 'mainBg', url: `${mainImgPath}bg.png`});
   } else {
      resource.push({ name: 'mainBg', url: `${mainImgPath}bg2.png`});
   }
   resource.push({ name: 'introInfoText', url: `${introImgPath}info_text_${langCode}.png`});

   return resource;
}
