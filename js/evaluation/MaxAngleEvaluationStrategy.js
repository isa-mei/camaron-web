"use strict";

class MaxAngleEvaluationStrategy extends EvaluationStrategy {
    constructor(model, mode) {
      	super(model, mode);
   	}

    evaluate() {
		return super.evaluate(
		   	['PolygonMesh', 'PolyhedronMesh'], 
		   	polytope =>{ const angles = this.model.modelType === 'PolygonMesh' ? polytope.angles : polytope.solidAngles;
				return Math.max(...angles); 
            }, 
			'Max Angles Histogram',
		   	this.model.modelType === 'PolygonMesh' ? 'Angles (radian)' : 'Angles (steradian)',
		);
    }

}