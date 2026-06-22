"use strict";

// requires "./SelectionStrategy";
// requires "../helpers";


class MaxAngleSelectionStrategy extends SelectionStrategy {
	constructor(model, mode, minAngle, maxAngle) {
	  	super(model, mode);
	  	this.minAngle = minAngle;
	  	this.maxAngle = maxAngle;
	}

	// Selecciona un polítopo si el ángulo máximo está en el rango de ángulos.
	selectPolytope(polytope) {
		super.selectPolytope(polytope, ['PolygonMesh', 'PolyhedronMesh'], 
			polytope => {
				const angles = this.model.modelType === 'PolygonMesh' ? polytope.angles : polytope.solidAngles;
				const maxAngle = Math.max(...angles);
				return this.minAngle <= maxAngle && maxAngle <= this.maxAngle;
			}
		)
	}

	get text() {
		return `By Max Angle: ${this.minAngle} - ${this.maxAngle}`;
	}
}