import { applyDefaultProps, PixiComponent, _ReactPixi } from "@inlet/react-pixi"
import { IPointData } from 'pixi.js';
import { Container3d, IEuler } from "pixi-projection";


export interface Container3dProps extends _ReactPixi.IContainer {
   position3d?: { x: number, y: number, z: number} | IPointData;
   scale3d?: { x: number, y: number, z: number} | IPointData;
   euler?: { x: number, y: number, z: number} | IEuler;
}



export default PixiComponent<Container3dProps, Container3d>('Container3d', {

   create: props => {
      return new Container3d();
   },

   applyProps: (instance, oldProps, newProps) => {
      if(instance && typeof instance.position3d === 'object') {
         if(newProps.position3d){
            instance.position3d.x = newProps.position3d.x;
            instance.position3d.y = newProps.position3d.y;
            instance.position3d.z = newProps.position3d.z;
         }
         if(newProps.scale3d){
            instance.scale3d.x = newProps.scale3d.x;
            instance.scale3d.y = newProps.scale3d.y;
            instance.scale3d.z = newProps.scale3d.z;
         }
         if(newProps.euler) {
            instance.euler.x = newProps.euler.x;
            instance.euler.y = newProps.euler.y;
            instance.euler.z = newProps.euler.z;
         }
      }
      applyDefaultProps(instance, oldProps, newProps);
   },

   config: {
      destroy: true,
      destroyChildren: true
   }

});