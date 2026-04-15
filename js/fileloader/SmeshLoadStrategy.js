"use strict";

// requires "./PolyLoadStrategy";

class SmeshLoadStrategy extends PolyLoadStrategy {

    load() {
        const [numVertices, dimensions] = this.loadHeader();
        this.model = new PolygonMesh();
        let startIndex = this.loadModelVertices(numVertices, 1, dimensions);
        this.loadModelFacets(startIndex);
        this.model.vertices = Array.from(Object.values(this.model.vertices));
    }

    // Carga facetas del modelo
    loadModelFacets(startIndex) {
        const facetHeaderLineWords = getLineWords(this.fileArray[startIndex]);
        if (![1,2].includes(facetHeaderLineWords.length) || !isPositiveInteger(facetHeaderLineWords[0])) {
            throw new Error('Facet header error');
        }
        const numFacets = parseInt(facetHeaderLineWords[0]);
        const boundary_marker = parseInt(facetHeaderLineWords[1]); // 1: indica que existe marcador en cada faceta
        const polygons = [];
        startIndex++;
        let offset = 0;
        let polygonCount = 1;

        for (let i = 0; i < numFacets; i++) {
            const facet = this.fileArray[startIndex + offset];
            let facetLineWords = getLineWords(facet);
            const cornersCount = parseInt(facetLineWords[0]);
            
            // Caso en que los vertices esten en dos lineas
            if (cornersCount > facetLineWords.length-1-boundary_marker){
                offset++;
                const corners = this.fileArray[startIndex + offset];
                const cornersLineWords = getLineWords(corners);
                facetLineWords = facetLineWords.concat(cornersLineWords);
            }

            // Ignora polígonos degenerados
            if (cornersCount < 3) continue;
            
            const polygon = new Polygon(polygonCount);
            for (let j = 1; j <= cornersCount; j++) {
                const vertexIndex = parseInt(facetLineWords[j]);
                const vertex = this.model.vertices[vertexIndex];
                // agrega cada vértice a los vértices del polígono
                polygon.vertices.push(vertex);
                // y agrega el nuevo polígono como parte de los polígonos de cada vértice
                vertex.polygons.push(polygon);
            }
            polygons.push(polygon);
            offset += 1  ;
            polygonCount++;
        }
        this.model.polygons = polygons;
    }
}