"use strict";

class EdgeRatioSelectionStrategy extends SelectionStrategy {
	constructor(model, mode, minEdgeRatio, maxEdgeRatio) {
		super(model, mode);
		this.minEdgeRatio = minEdgeRatio;
        this.maxEdgeRatio = maxEdgeRatio;
	}
	
   	// Selecciona un polítopo si cumple con el Edge ratio.
   	selectPolytope(polytope) {
		super.selectPolytope(polytope, ['PolygonMesh', 'PolyhedronMesh'], 
			polytope => {
				const edgeRatio = polytope.edgeRatio;
				return this.minEdgeRatio <= edgeRatio && edgeRatio <= this.maxEdgeRatio;
			}
		)
	}

	get text() {
		return `By Edge Ratio: ${this.minEdgeRatio} - ${this.maxEdgeRatio}`;
	}
}