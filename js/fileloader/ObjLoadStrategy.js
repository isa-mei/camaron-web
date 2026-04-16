"use strict";

// requires "./ModelLoadStrategy";
// requires "../model/PolygonMesh";
// requires "../model/vertex";
// requires '../model/Polygon';
// requires "../helpers";


class ObjLoadStrategy extends ModelLoadStrategy {
    // https://en.wikipedia.org/wiki/Wavefront_.obj_file
    // https://people.sc.fsu.edu/~jburkardt/data/obj/obj.html

    load() {
        const [numVertices, numPolygons] = this.loadHeader();
        this.model = new PolygonMesh();
        const polygonStartIndex = this.loadModelVertices(numVertices, 0);
        this.loadModelFaces(numPolygons, polygonStartIndex);
        this.model.vertices = Array.from(Object.values(this.model.vertices));
    }


    loadHeader() {
        // formato vértices: v x y z
        // se deja "x y z"
        const vertices = this.fileArray.filter(line => line.startsWith('v '))
                    .map(line => {return line.slice(2);});

        // formato de cara: f v1/vt1/vn1 v2/vt2/vn2 ...
        // solo se deja 'v1 v2 ...'
        const faces = this.fileArray.filter(line => line.startsWith('f '))
                    .map(line => {
                        const elements = line.slice(2).split(' ');
                        return elements.map(element => {
                            const vertexIndex = element.split('/')[0];
                            return vertexIndex;
                        }).join(' ');});

        // se reescribe el archivo con solo los vértices y las caras, para facilitar la carga
        this.fileArray = vertices.concat(faces);
        return [vertices.length, faces.length];
    }

    /* 
        Carga las caras del modelo
        numPolygons: cantidad de caras a cargar
        startIndex: Indice a partir del cual se encuentran las caras en el archivo, 
                    asimismo indica la cantidad total de vertices
    */
    loadModelFaces(numPolygons, startIndex) {
        if (startIndex + numPolygons > this.fileArray.length) {
         throw new Error('polygonCountError');
      }
      const polygons = new Array(numPolygons);
      for (let i = 0; i < numPolygons; i++) {
        const line = this.fileArray[startIndex + i];
        const lineWords = getLineWords(line);
        const vertexCount = lineWords.length;
        if (vertexCount < 3) continue; // Ignora polígonos degenerados
        // Para cada cara se crea un poligono
        const polygon = new Polygon(i+1);
        // para cada índice de vértice
        for(let j = 0; j < vertexCount; j++) {
        let vertexIndex = parseInt(lineWords[j]);
            if (!isPositiveInteger(vertexIndex)){
                // 
                // vertexIndex = Math.abs(vertexIndex);
                vertexIndex = startIndex + vertexIndex + 1;
            }
            const vertex = this.model.vertices[vertexIndex-1];
            // agrega cada vértice a los vértices del polígono
            polygon.vertices.push(vertex);
            // y agrega el nuevo polígono como parte de los polígonos de cada vértice
            vertex.polygons.push(polygon);
        }
        polygons[i] = polygon;
      }
      this.model.polygons = polygons;
      return startIndex + numPolygons;
    }

    _exportToObj() {
        return this.fileArray.join('\n');
    }
}