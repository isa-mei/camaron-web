"use strict";

// requires "./ModelLoadStrategy";
// requires "../model/PolygonMesh";
// requires "../model/vertex";
// requires '../model/Polygon';
// requires "../helpers";

class M3DLoadStrategy extends ModelLoadStrategy {
    constructor(fileArray) {
        super(fileArray);
        // T:tetraedro, P: piramide, R:prisma, H: hexaedro
        this.vertexNum = new Map([
            ['T', 4],
            ['P', 5],
            ['R', 6],
            ['H', 8]
        ]);
        // combinacion de los indices de los verices para formar las caras de cada poliedro. Por convencion van en orden antihorario
        this.polyElements = new Map([
            ['T', [[0, 2, 1], [0, 3, 2], [0, 1, 3], [1, 2, 3]]],
            ['P', [[0, 3, 2, 1], [0, 1, 4], [1, 2, 4], [2, 3, 4], [0, 4, 3]]],
            ['R', [[0, 2, 1], [0, 1, 4 ,3], [1, 2, 5, 4], [0, 3, 5, 2], [3, 4, 5]]],
            ['H', [[0, 3, 2, 1], [1, 2, 6, 5], [2, 3, 7, 6], [0, 4, 7, 3], [0, 1, 5, 4], [4, 5, 6, 7]]]
        ]);
    }
    
    load() {
        const numVertices = this.loadHeader();
        this.model = new PolyhedronMesh();
        let startIndex = this.loadModelVertices(numVertices, 2);
        this.loadModelElements(startIndex);
        // console.log(this.fileArray);
        this.model.vertices = Array.from(Object.values(this.model.vertices));
    }

    loadHeader() {
        const headerLineWords = getLineWords(this.fileArray[0]);
        const vertexNum = getLineWords(this.fileArray[1])[0];
        if(!headerLineWords[0].includes('Nodes') && !isPositiveInteger(vertexNum)) {
            throw new Error('Vertex format error');
        }
        return parseInt(vertexNum);
    }

    setVertex(numVertices, startIndex) {
        const verticesArray = this.fileArray.slice(startIndex, startIndex + numVertices).map(
            line => {
                if (getLineWords(line).length > 3 && ['0', '1', '2', '3'].includes(line[0])) {
                    return line.slice(2);
                }
                else {
                    throw new Error('Vertex format error: do not have the right format or dimension');
                }
            }
        );
        for (let i = 0; i < numVertices; i++) {
            this.fileArray[startIndex + i] = verticesArray[i];
        }
    }

    loadModelVertices(numVertices, startIndex) {
        this.setVertex(numVertices, startIndex);
        return super.loadModelVertices(numVertices, startIndex);
    }

    loadModelElements(startIndex) {
        const elementHeaderLineWords = getLineWords(this.fileArray[startIndex]);
        const numElements = parseInt(getLineWords(this.fileArray[startIndex + 1])[0]);
        if (!elementHeaderLineWords[0].includes('Elements') || numElements <= 0) {
            throw new Error('Elements format error');
        }

        const FEMelements = 3;
        const polyhedrons = new Array(numElements);
        startIndex += 2;
        let polygonIndex = 1;
        const polygons = [];

        // Para cada linea que contiene el tipo de elemento con sus vertices, se crea un poliedro y luego los poligonos que lo componen
        for (let i = 0; i < numElements; i++) {
            const line = this.fileArray[startIndex + i];
            const elementLineWords = getLineWords(line);
            const elementType = elementLineWords[0];
            if (!this.vertexNum.has(elementType) || elementLineWords.length !== this.vertexNum.get(elementType) + 1 + FEMelements){
                throw new Error('Element format error');
            }
            const polyhedron = new Polyhedron(i);
            const vertexIndexes = elementLineWords.slice(1, 1 + this.vertexNum.get(elementType)).map(index => parseInt(index));
            // Agrega cada vertice al poliedro y agrega el poliedro a cada vértice
            for (const vertex of vertexIndexes.map(index => this.model.vertices[index])) {
                vertex.polyhedrons.push(polyhedron);
                polyhedron.vertices['' + vertex.id] = vertex;
            }
            // Se crea un poligono para cada cara del poliedro y se agregan a las shapes correspondientes
            for (let j = 0; j < this.polyElements.get(elementType).length; j++) {
                const vertexIndexesPolygon = this.polyElements.get(elementType)[j].map(index => vertexIndexes[index]);
                const polygon = new Polygon(polygonIndex++);
                for (const vertexIndex of vertexIndexesPolygon) {
                    const vertex = this.model.vertices[vertexIndex];
                    // agrega cada vértice a los vértices del polígono
                    polygon.vertices.push(vertex);
                    // y agrega el nuevo polígono como parte de los polígonos de cada vértice
                    vertex.polygons.push(polygon);
                }
                polyhedron.polygons.push(polygon);            
                polygons.push(polygon);
            }
            polyhedron.vertices = Array.from(Object.values(polyhedron.vertices));
            this.model.polygons.push(...polyhedron.polygons);
            polyhedrons[i] = polyhedron;
        }
        Object.keys(this.model.vertices).forEach(key => {
         this.model.vertices[key].polyhedrons = Array.from(Object.values(this.model.vertices[key].polyhedrons));
        })
        this.model.polyhedrons = polyhedrons;
    }

    _exportToM3D() {
        return this.fileArray.join('\n');
    }
}