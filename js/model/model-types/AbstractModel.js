"use strict";


class AbstractModel {
   constructor() {
      this.bounds = [];
      this.center = null;
      this.modelWidth = 0;
      this.modelHeight = 0;
      this.modelDepth = 0;
      this.modelType = null;
      this.loaded = false;
   }

   loadBuffers() {
      this.loaded = true;
  }

   doLoadBuffers() {
      try {
         this.loadBuffers();
      } catch (error) {
         console.error(error);
         closeModal('modal-loading');
         openModal('modal-error', 'Error loading buffers model: ' + error.message);
      }
   }
}