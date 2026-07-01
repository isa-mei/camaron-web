"use strict";

// requires "./SelectionStrategy";
// requires "../helpers";


class MaxDihedralAngleSelectionStrategy extends SelectionStrategy {
	constructor(model, mode, minAngle, maxAngle) {
	  	super(model, mode);
	  	this.minAngle = minAngle;
	  	this.maxAngle = maxAngle;
	}

	// Selecciona un polítopo si el ángulo diedro máximo está en el rango de ángulos.
	selectPolytope(polytope) {
		super.selectPolytope(polytope, ['PolygonMesh'], 
			polytope => {
				const angles = Array.from(polytope.dihedralAngles.values());
				const maxAngle = Math.max(...angles);
				return angles.some(angle => this.minAngle <= maxAngle && maxAngle <= this.maxAngle);
			}
		)
	}

	get text() {
		return `By Max Dihedral Angle: ${this.minAngle} - ${this.maxAngle}`;
	}
}