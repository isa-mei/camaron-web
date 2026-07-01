"use strict";

// requires "./SelectionStrategy";
// requires "../helpers";


class MinDihedralAngleSelectionStrategy extends SelectionStrategy {
	constructor(model, mode, minAngle, maxAngle) {
	  	super(model, mode);
	  	this.minAngle = minAngle;
	  	this.maxAngle = maxAngle;
	}

	// Selecciona un polítopo si el ángulo diedro mínimo está en el rango de ángulos.
	selectPolytope(polytope) {
		super.selectPolytope(polytope, ['PolygonMesh'], 
			polytope => {
				const angles = Array.from(polytope.dihedralAngles.values());
				const minAngle = Math.min(...angles);
				return angles.some(angle => this.minAngle <= minAngle && minAngle <= this.maxAngle);
			}
		)
	}

	get text() {
		return `By Min Dihedral Angle: ${this.minAngle} - ${this.maxAngle}`;
	}
}