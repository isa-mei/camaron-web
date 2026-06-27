"use strict";

// requires "./SelectionStrategy";
// requires "../helpers";


class DihedralAngleSelectionStrategy extends SelectionStrategy {
	constructor(model, mode, minAngle, maxAngle) {
	  	super(model, mode);
	  	this.minAngle = minAngle;
	  	this.maxAngle = maxAngle;
	}

	// Selecciona un polítopo si está en el rango de ángulos.
	selectPolytope(polytope) {
		super.selectPolytope(polytope, ['PolygonMesh'], 
			polytope => {
				const angles = Array.from(polytope.dihedralAngles.values());
				return angles.some(angle => this.minAngle <= angle && angle <= this.maxAngle);
			}
		)
	}

	get text() {
		return `By Angle: ${this.minAngle} - ${this.maxAngle}`;
	}
}