"use strict";

class EdgeRatioEvaluationStrategy extends EvaluationStrategy {
    constructor(model, mode) {
        super(model, mode);
    }

    evaluate() {
        return super.evaluate(
            ['PolygonMesh', 'PolyhedronMesh'],
            polytope => polytope.edgeRatio,
            'Edge Ratio Histogram',
            'Edge Ratio'
        );
    }
}