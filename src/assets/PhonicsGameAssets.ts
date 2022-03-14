
const fontPath = 'fonts/';
const audioPath = 'audio/';
const commonImgPath = 'images/game/common/';
const introImgPath = 'images/game/phonics/intro/';
const mainImgPath = 'images/game/phonics/main/';
const resultImgPath = 'images/game/phonics/result/';
const spritesheetPath = 'images/game/phonics/spritesheet/';


export default ( step: number, langCode: string, low: number ) => {
   
   const resource = [

      //common
      { name: 'LexendDeca-Light', url: `${fontPath}LexendDeca-Light.ttf`},
      { name: 'LexendDeca-Regular', url: `${fontPath}LexendDeca-Regular.ttf`},
      { name: 'LexendDeca-SemiBold', url: `${fontPath}LexendDeca-SemiBold.ttf`},
      { name: 'Maplestory Bold', url: `${fontPath}Maplestory Bold.ttf`},
      { name: 'audioBgm', url: `${audioPath}bgm_phonics.mp3` },
      { name: 'audioClick', url: `${audioPath}click.mp3` },
      { name: 'audioCorrect', url: `${audioPath}correct.mp3` },
      { name: 'audioWrong', url: `${audioPath}wrong.mp3` },
      { name: 'audioArrowShoot', url: `${audioPath}arrow_shoot.mp3` },
      { name: 'audioArrowHit', url: `${audioPath}arrow_hit.mp3` },
      { name: 'audioBonus', url: `${audioPath}bonus.mp3` },
      { name: 'audioGameover', url: `${audioPath}game_over.mp3` },
      { name: 'commonExitBtn', url: `${commonImgPath}exit_btn.png` },
      
      
      
      // intro
      { name: 'commonBgmOnBtn', url: `${commonImgPath}bgm_btn_on.png` },
      { name: 'commonBgmOffBtn', url: `${commonImgPath}bgm_btn_off.png` },
      { name: 'commonBackBtn', url: `${commonImgPath}back_btn.png` },
      { name: 'introBg', url: `${introImgPath}bg.png`},
      { name: 'introGuide', url: `${introImgPath}guide_img.png`},
      { name: 'introCharactor', url: `${introImgPath}charactor.png`},
      { name: 'introAimTarget', url: `${introImgPath}aim_target.png`},
      { name: 'introStartBtnDefault', url: `${introImgPath}start_btn_default.png`},
      { name: 'introStartBtnHover', url: `${introImgPath}start_btn_hover.png`},
      { name: 'introInfoBtn', url: `${introImgPath}info_btn.png`},
      { name: 'introMainTitle', url: `${introImgPath}main_title.png`},
      { name: 'introSubTitle1', url: `${introImgPath}sub_title1.png`},
      { name: 'introSubTitle2', url: `${introImgPath}sub_title2.png`},
      { name: 'introLine', url: `${introImgPath}line.png`},
      { name: 'introTextLight', url: `${introImgPath}text_light.png`},
      { name: 'introLeftFocus', url: `${introImgPath}focus_left.png`},
      { name: 'introTopFocus', url: `${introImgPath}focus_top.png`},
      { name: 'introRightFocus', url: `${introImgPath}focus_right.png`},



      // main
      { name: 'commonResetBtn', url: `${commonImgPath}reset_btn.png` },
      { name: 'commonSoundBtnOff', url: `${commonImgPath}sound_btn_off.png`},
      { name: 'commonSoundBtnOn', url: `${commonImgPath}sound_btn_on.png`},
      { name: 'commonProgressBar1', url: `${commonImgPath}progress_bar1.png` },
      { name: 'commonProgressBar2', url: `${commonImgPath}progress_bar2.png` },
      { name: 'commonLightGradient', url: `${commonImgPath}light_gradient.png` },
      { name: 'mainBg', url: `${mainImgPath}bg.png`},
      { name: 'mainBottomUiBg', url: `${mainImgPath}bottom_ui_bg.png` },
      { name: 'mainScoreBg', url: `${mainImgPath}score_bg.png`},
      { name: 'mainScoreTitle', url: `${mainImgPath}score_title.png`},
      { name: 'mainScorePlus100', url: `${mainImgPath}score_plus_100.png`},
      { name: 'mainScorePlus200', url: `${mainImgPath}score_plus_200.png`},
      { name: 'mainScorePlus300', url: `${mainImgPath}score_plus_300.png`},
      { name: 'mainScoreMinus10', url: `${mainImgPath}score_minus_10.png`},
      { name: 'mainProgressBg', url: `${mainImgPath}progress_bg.png` },
      { name: 'mainShootStick', url: `${mainImgPath}shoot_stick.png`},
      { name: 'mainShootArrow', url: `${mainImgPath}shoot_arrow.png`},
      { name: 'mainBonusArrow', url: `${mainImgPath}bonus_arrow.png`},
      { name: 'mainDesk', url: `${mainImgPath}desk.png`},
      { name: 'mainShootTargetBottom', url: `${mainImgPath}shoot_target_bottom.png`},
      { name: 'mainShootTargetPannel', url: `${mainImgPath}shoot_target_pannel.png`},
      { name: 'mainShootTargetBack', url: `${mainImgPath}shoot_target_back.png`},
      { name: 'mainShootTargetShadow', url: `${mainImgPath}shoot_target_shadow.png`},
      { name: 'mainSingPannel', url: `${mainImgPath}sign_pannel.png`},
      { name: 'mainSingOn', url: `${mainImgPath}sign_on.png`},
      { name: 'mainRoundRect', url: `${mainImgPath}round_rect.png`},
      { name: 'mainCircle', url: `${mainImgPath}circle.png`},
      { name: 'mainStar', url: `${mainImgPath}star.png`},
      { name: 'mainHart', url: `${mainImgPath}hart.png`},
      { name: 'mainBonusHart', url: `${mainImgPath}bonus_hart.png`},
      { name: 'mainAim', url: `${mainImgPath}aim.png`},
      { name: 'mainBlurCircle', url: `${mainImgPath}blur_circle.png`},
      { name: 'mainOne', url: `${mainImgPath}one.png`},
      { name: 'mainLight', url: `${mainImgPath}light.png`},
      { name: 'mainBlurScratch', url: `${mainImgPath}blur_scratch.png`},
      { name: 'mainBonusSpark', url: `${mainImgPath}bonus_spark.png`},
      { name: 'mainBonusCircle', url: `${mainImgPath}bonus_circle.png`},
      { name: 'mainBonusBg', url: `${mainImgPath}bonus_bg.png`},
      { name: 'mainBonusOnGlow', url: `${mainImgPath}bonus_on_glow.png`},
      { name: 'mainBonusMask', url: `${mainImgPath}bonus_mask.png`},
      { name: 'commonExplodEffect', url: `${commonImgPath}spritesheet/explod_effect.json` },
      { name: 'spritesheetArrowLight1', url: `${spritesheetPath}arrow_light1.json` },
      { name: 'spritesheetArrowLight2', url: `${spritesheetPath}arrow_light2.json` },

      

      // result
      { name: 'commonResultBg', url: `${commonImgPath}result_bg.png` },
      { name: 'commonResultButtonDefault', url: `${commonImgPath}result_btn_default.png` },
      { name: 'commonResultButtonHover', url: `${commonImgPath}result_btn_hover.png` },
      { name: 'commonAgainButtonDefault', url: `${commonImgPath}again_btn_default.png` },
      { name: 'commonAgainButtonHover', url: `${commonImgPath}again_btn_hover.png` },
      { name: 'resultLeftSuccess', url: `${resultImgPath}top_left_success_img.png`},
      { name: 'resultRightSuccess', url: `${resultImgPath}top_right_success_img.png`},
      { name: 'resultLeftFailed', url: `${resultImgPath}top_left_failed_img.png`},
      { name: 'resultRightFailed', url: `${resultImgPath}top_right_failed_img.png`},
      { name: 'resultSuccessMsg1', url: `${resultImgPath}success_message1.png`},
      { name: 'resultSuccessMsg2', url: `${resultImgPath}success_message2.png`},
      { name: 'resultSuccessMsg3', url: `${resultImgPath}success_message3.png`},
      { name: 'resultFailedMsg1', url: `${resultImgPath}failed_message1.png`},
      { name: 'resultFailedMsg2', url: `${resultImgPath}failed_message2.png`},
      { name: 'resultFailedMsg3', url: `${resultImgPath}failed_message3.png`},   

   ];


   if(step < 3) {
      resource.push({ name: 'spritesheetCharactorDefault', url: `${spritesheetPath}charactor_default.json` });
      resource.push({ name: 'spritesheetCharactorBonus', url: `${spritesheetPath}charactor_bonus.json` });
      if(step > 1) {
         resource.push({ name: 'introInfoText', url: `${introImgPath}info_text_${langCode}_2.png`});
      } else {
         resource.push({ name: 'introInfoText', url: `${introImgPath}info_text_${langCode}_1.png`});
      }
   } else {
      resource.push({ name: 'spritesheetCharactorDefault', url: `${spritesheetPath}charactor_default2.json` });
      resource.push({ name: 'spritesheetCharactorBonus', url: `${spritesheetPath}charactor_bonus2.json` });
      resource.push({ name: 'introInfoText', url: `${introImgPath}info_text_${langCode}_3.png`});
   }

   

   if(low === 0) {
      resource.push({ name: 'commonWatchBody', url: `${commonImgPath}watch_body.png` });
      resource.push({ name: 'commonWatchButton', url: `${commonImgPath}watch_button.png` });
      resource.push({ name: 'commonWatchBubble', url: `${commonImgPath}watch_bubble.png` });
   } else {
      resource.push({ name: 'commonWatch', url: `${commonImgPath}watch.png` });
   }

   return resource;
};
