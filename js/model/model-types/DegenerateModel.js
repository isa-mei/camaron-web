"use strict";

class DegenerateModel extends VertexCloud {
    constructor() {
        super();
        this.modelType = 'DegenerateModel';
        this.polygons =[];
        this.degenerateVertices = {};
        this.degeneratePolygons = [];
    }

    loadBuffers() {
        this.loadDegenerateElements();
        this.loaded = true;
    }

    getElementsFromModel(model) {
        if(['PolygonMesh', 'PolyhedronMesh'].includes(model.modelType)){
        this.vertices = model.vertices;
        this.polygons = model.polygons;
        this.bounds = model.bounds;
        this.center = model.center;
        this.modelWidth = model.modelWidth;
        this.modelHeight = model.modelHeight;
        this.modelDepth = model.modelDepth;
        
        gl.deleteBuffer(this.verticesBuffer);
        gl.deleteBuffer(this.vertexIdsBuffer.position);
        gl.deleteBuffer(this.vertexIdsBuffer.texcoord);
        
        this.verticesBuffer = model.verticesBuffer;
        this.vertexIdsBuffer = model.vertexIdsBuffer;
        this.vertexIdsLength = model.vertexIdsLength;

        gl.deleteBuffer(model.edgesBuffer);
        gl.deleteBuffer(model.trianglesBuffer);
        gl.deleteBuffer(model.verticesNormalsBuffer);
        gl.deleteBuffer(model.trianglesNormalsBuffer);
        gl.deleteBuffer(model.vertexNormalsLinesBuffer);
        gl.deleteBuffer(model.faceNormalsLinesBuffer);
        gl.deleteBuffer(model.faceIdsBuffer.position);
        gl.deleteBuffer(model.faceIdsBuffer.textcoord);
        } else {
            throw new Error('Only PolygonMesh and PolyhedronMesh are supported to create a DegenerateModel');
        }
    }

    loadDegenerateElements() {
        for (const polygon of this.polygons) {
            for (let i = 0; i < polygon.lengths.length; i++) {
                if (polygon.lengths[i] < 1e-5){
                    if(!this.degenerateVertices[polygon.id]){
                        this.degeneratePolygons.push(polygon);
                        this.degenerateVertices[polygon.id] = [[polygon.vertices[i], polygon.vertices[(i + 1) % polygon.vertices.length]]]
                    } else {
                        this.degenerateVertices[polygon.id].push([polygon.vertices[i], polygon.vertices[(i + 1) % polygon.vertices.length]]);

                    }
                }
            }
        }
    }
}