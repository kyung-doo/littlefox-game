import { applyDefaultProps, PixiComponent, _ReactPixi } from "@inlet/react-pixi"
import { Camera3d } from "pixi-projection";


export interface Camera3dProps extends _ReactPixi.IContainer {
   setPlanes?: any[];
}


export default PixiComponent<Camera3dProps, Camera3d>('Camera3d', {

   create: props => {
      return new Camera3d();
   },

   applyProps: (instance, oldProps, newProps) => {
      if(instance && typeof instance.setPlanes === 'function' && newProps.setPlanes) {
         instance.setPlanes(newProps.setPlanes[0], newProps.setPlanes[1], newProps.setPlanes[2], newProps.setPlanes[3]);
      }
      applyDefaultProps(instance, oldProps, newProps);
   },

   config: {
      destroy: true,
      destroyChildren: true
   }

});