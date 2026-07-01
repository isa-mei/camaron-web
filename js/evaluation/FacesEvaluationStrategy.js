"use strict";


class FacesEvaluationStrategy extends EvaluationStrategy {
    constructor(model, mode) {
        super(model, mode);
    }

    evaluate() {
        return super.evaluate(
            ['PolyhedronMesh'], 
            polytope => polytope.polygons.length, 
            'Faces Histogram', 
            'Faces Number'
        );
    }
}