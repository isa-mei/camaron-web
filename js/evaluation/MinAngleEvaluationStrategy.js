"use strict";

class MinAngleEvaluationStrategy extends EvaluationStrategy {
    constructor(model, mode) {
      	super(model, mode);
   	}

    evaluate() {
		return super.evaluate(
		   	['PolygonMesh', 'PolyhedronMesh'], 
		   	polytope =>{ const angles = this.model.modelType === 'PolygonMesh' ? polytope.angles : polytope.solidAngles;
				return Math.min(...angles); 
            }, 
			'Min Angles Histogram',
		   	this.model.modelType === 'PolygonMesh' ? 'Angles (radian)' : 'Angles (steradian)',
		);
    }

}