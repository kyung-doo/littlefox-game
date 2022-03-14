import { useCallback, useState, useRef } from 'react';
import { Loader, Spritesheet } from 'pixi.js';
import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import '@pixi/sound';

Loader.registerPlugin(WebfontLoaderPlugin);


export type AssetsTypes = {
   name: string;
   url: string;
   noRequired?: boolean | undefined;
}

let _resources: any = null;

const useAssets = () => {
   
   const loaderRef = useRef<Loader | null>(null);
   const [resources, setResources] = useState<any>(_resources);
   const [loadComplete, setLoadComplete] = useState<boolean>(false);

   const loadStart = useCallback(( assets: AssetsTypes[] ) => {
      
      loaderRef.current = new Loader();
      assets.forEach( asset  => {
         if(asset.url.indexOf('json') === -1) {
            if(asset.noRequired) {
               loaderRef.current!.add(asset.name, asset.url);
            } else {
               loaderRef.current!.add(asset.name, require(`../assets/${asset.url}`).default);
            }
         } else {
            const data = require(`../assets/${asset.url}`);
            const imgPathAr = asset.url.split('/');
            imgPathAr.pop();
            const imgPath = `${imgPathAr.join('/')}/${data.meta.image}`;
            loaderRef.current!.add(asset.name, require(`../assets/${imgPath}`).default, (resource) =>{
               if(resource.texture){
                  const spritesheet = new Spritesheet(resource.texture.baseTexture, data);
                  spritesheet.parse( texturs => {
                     if(texturs){
                        resource.textures = texturs;
                        resource.texture?.destroy();
                        resource.texture = undefined;
                     }
                  });
               }
            });
         }
      });

      loaderRef.current!.load((loader, resources) => {
         _resources = resources;
         setResources(resources);
         loader.destroy();
         loaderRef.current = null;
         setLoadComplete(true);
      });

   }, []);


   return {
      resources,
      loadStart,
      loadComplete
   }
}

export default useAssets;