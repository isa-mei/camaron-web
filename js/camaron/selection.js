"use strict";

// requires "../selection/IdSelectionStrategy";
// requires "../selection/AngleSelectionStrategy";
// requires "../selection/AreaSelectionStrategy";
// requires "../selection/EdgesSelectionStrategy";
// requires "./helpers";

/*--------------------------------------------------------------------------------------
-------------------------------------- SELECTIONS --------------------------------------
----------------------------------------------------------------------------------------

These functions are for controlling when a selection is applied.
These should be eventually refactored for readability purposes. 
--------------------------------------------------------------------------------------*/

const applySelections = () => {
   
   for (const appliedSelection of appliedSelections) {
      appliedSelection.apply();
   }
   if (mainRenderer) {
      mainRenderer.updateColor();
   }
   draw();
   updateActiveSelections();
}

const updateActiveSelections = () => {
   const selectionsContainer = document.getElementById("selections-container");
   selectionsContainer.innerHTML = '';

   const selectionImages = {
      "clean": "img/btn-normal.svg",
      "intersect": "img/btn-intercept.svg",
      "add": "img/btn-add.svg",
      "substract": "img/btn-substract.svg"
   };
   for (let i = 0; i < appliedSelections.length; i++) {
      const selection = appliedSelections[i];
      const selectionTab = document.createElement("li");
      const img = document.createElement("img");
      const div = document.createElement("div");
      const span = document.createElement("span");
      const text = document.createTextNode(selection.text);
      const remove = document.createElement("i");

      img.setAttribute("src", selectionImages[selection.mode]);
      div.setAttribute("class", "grow");
      span.appendChild(text);
      div.appendChild(span);
      remove.setAttribute("class", "material-icons");
      remove.appendChild(document.createTextNode("close"));
      remove.setAttribute("data-index", i);
      remove.onclick = () => removeSelection(remove);

      selectionTab.appendChild(img);
      selectionTab.appendChild(div);
      selectionTab.appendChild(remove);
        
      selectionsContainer.appendChild(selectionTab);
   }   
}

const removeSelection = (button) => {
   const index = button.getAttribute("data-index");
   const selection = appliedSelections[index];
  
   if (selection.mode == "clean") {
      selection.clean();
      appliedSelections = [];
   } else {
      appliedSelections.splice(index, 1);
   }
   applySelections();
}

const applyButtonHandler = (e) => {
   if (e.target.classList.contains('disabled')) {
      return;
   }
   const selectionMethod = document.querySelector("#selection-type .button").getAttribute('value');
   const selectionModeOptions = Array.from(document.getElementsByName("mode-opt"));
   const checkedMode = selectionModeOptions.find(element => element.checked);
   if (!checkedMode) 
      return 
   const selectionMode = checkedMode.value;
   let selection = null;

   if (selectionMethod == 'id') {
      const specificMethodOptions = Array.from(document.getElementsByName("id-opt"));
      const checkedMethod = specificMethodOptions.find(element => element.checked);
      if (!checkedMethod)
         return  
      const specificMethod = checkedMethod.value;
      let idFrom = null;
      let idTo = null;
      let list = null;
    
      if(specificMethod == 'range') {
         idFrom = document.getElementById("id_from").value;
         idTo = document.getElementById("id_to").value;
      } else {
         list = document.getElementById("id_list").value.split(',');
      }
      selection = new IdSelectionStrategy(model, selectionMode, idFrom, idTo, list);
   }
   else if (selectionMethod.startsWith('angle')){
      const angleType = document.querySelector('input[name="selection-angle-mode"]:checked').value;
      const method = selectionMethod.replace("-", "_");
      let angleFrom = document.getElementById(method + "_from").value;
      let angleTo = document.getElementById(method + "_to").value;
      if (angleType === 'deg'){
         if(selectionMethod.startsWith('angle2')){
            angleFrom = sqDegToSr(angleFrom);
            angleTo = sqDegToSr(angleTo);
         } else {
            angleFrom = degToRad(angleFrom);
            angleTo = degToRad(angleTo);
         }
      }
      if (selectionMethod == 'angle3'){ 
         selection = new DihedralAngleSelectionStrategy(model, selectionMode, angleFrom, angleTo);
      } else if (selectionMethod == 'angle' || selectionMethod == 'angle2'){
         selection = new AngleSelectionStrategy(model, selectionMode, angleFrom, angleTo);
      } else if (selectionMethod == 'angle-min' || selectionMethod == 'angle2-min'){
         selection = new MinAngleSelectionStrategy(model, selectionMode, angleFrom, angleTo);
      } else if (selectionMethod == 'angle-max' || selectionMethod == 'angle2-max'){
         selection = new MaxAngleSelectionStrategy(model, selectionMode, angleFrom, angleTo);
      } else if (selectionMethod == 'angle3-min'){
         selection = new MinDihedralAngleSelectionStrategy(model, selectionMode, angleFrom, angleTo);
      } else if (selectionMethod == 'angle3-max'){
         selection = new MaxDihedralAngleSelectionStrategy(model, selectionMode, angleFrom, angleTo);
      } 
   }
   else if (selectionMethod == 'area') {
      const areaFrom = document.getElementById("area_from").value;
      const areaTo = document.getElementById("area_to").value;
      selection = new AreaSelectionStrategy(model, selectionMode, areaFrom, areaTo);
   }
   else if (selectionMethod == 'volume') {
      const volumeFrom = document.getElementById("volume_from").value;
      const volumeTo = document.getElementById("volume_to").value;
      selection = new VolumeSelectionStrategy(model, selectionMode, volumeFrom, volumeTo);
   } 
   else if (selectionMethod == 'aspect-ratio') {
      const aspectRatioFrom = document.getElementById("aspect_ratio_from").value;
      const aspectRatioTo = document.getElementById("aspect_ratio_to").value;
      selection = new AspectRatioSelectionStrategy(model, selectionMode, aspectRatioFrom, aspectRatioTo);
   }
   else if (selectionMethod == 'edge-ratio') {
      const edgeRatioFrom = document.getElementById("edge_ratio_from").value;
      const edgeRatioTo = document.getElementById("edge_ratio_to").value;
      selection = new EdgeRatioSelectionStrategy(model, selectionMode, edgeRatioFrom, edgeRatioTo);
   }
   else if (selectionMethod == 'edges') {
      const edges_number = document.getElementById("edges_number").value;
      selection = new EdgesSelectionStrategy(model, selectionMode, edges_number)
   }
   if (selectionMode == 'clean') 
      appliedSelections = [selection];
   else
      appliedSelections.push(selection);

   // Finalmente cambia el estado de la variable global hideUnselected dependiendo si está seleccionada en el checkbox.
   const hideUnselectedCheckbox = document.getElementById('hide-unselected')
   hideUnselected = hideUnselectedCheckbox.checked;

   applySelections();
}