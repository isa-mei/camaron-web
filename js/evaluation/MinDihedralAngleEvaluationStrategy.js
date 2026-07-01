"use strict";


class MinDihedralAngleEvaluationStrategy extends EvaluationStrategy {
	constructor(model, mode) {
      	super(model, mode);
   	}

	evaluate() {
		return super.evaluate(
		   	['PolygonMesh'], 
		   	polytope => {
				const dihedralAngles = [];
				polytope.dihedralAngles.forEach((angle, neighborId) => {
					if (polytope.id < neighborId) {
						dihedralAngles.push(angle);
					}
				});
				return Math.min(...dihedralAngles);
			}, 
			'Min Angles Histogram',
		   	'Angles (radian)'
		);
	}
}