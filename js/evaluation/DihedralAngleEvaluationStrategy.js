"use strict";


class DihedralAngleEvaluationStrategy extends EvaluationStrategy {
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
				return dihedralAngles;
			}, 
			'Angles Histogram',
		   	'Angles (radian)'
		);
	}
}