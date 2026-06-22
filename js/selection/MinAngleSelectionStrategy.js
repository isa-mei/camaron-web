"use strict";

// requires "./SelectionStrategy";
// requires "../helpers";


class MinAngleSelectionStrategy extends SelectionStrategy {
	constructor(model, mode, minAngle, maxAngle) {
	  	super(model, mode);
	  	this.minAngle = minAngle;
	  	this.maxAngle = maxAngle;
	}

	// Selecciona un polítopo si el ángulo mínimo está en el rango de ángulos.
	selectPolytope(polytope) {
		super.selectPolytope(polytope, ['PolygonMesh', 'PolyhedronMesh'], 
			polytope => {
				const angles = this.model.modelType === 'PolygonMesh' ? polytope.angles : polytope.solidAngles;
				const minAngle = Math.min(...angles);
				return this.minAngle <= minAngle && minAngle <= this.maxAngle;
			}
		)
	}

	get text() {
		return `By Min Angle: ${this.minAngle} - ${this.maxAngle}`;
	}
}