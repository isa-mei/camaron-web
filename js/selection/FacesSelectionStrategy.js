"use strict";

// requires "./SelectionStrategy";


class FacesSelectionStrategy extends SelectionStrategy {
	constructor(model, mode, facesNumber) {
		super(model, mode);
		this.facesNumber = facesNumber;
	}

   // Selecciona un polítopo si cumple con la cantidad de caras
   	selectPolytope(polytope) {
		super.selectPolytope(polytope, ['PolyhedronMesh'], 
			polytope => polytope.polygons.length == this.facesNumber
		)
	}

	get text() {
		return `By Faces Number: ${this.facesNumber}`;
	}
}