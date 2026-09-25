
let canvas = document.getElementById("glCanvas");

let gl = canvas.getContext("webgl2");
if (!gl) {alert("No WebGL");}

let fileArray = ["OFF", "8 6 0", "-0.500000 -0.500000 0.500000", "0.500000 -0.500000 0.500000", "-0.500000 0.500000 0.500000", "0.500000 0.500000 0.500000", "-0.500000 0.500000 -0.500000", "0.500000 0.500000 -0.500000", "-0.500000 -0.500000 -0.500000", "0.500000 -0.500000 -0.500000", "4 0 1 3 2", "4 2 3 5 4", "4 4 5 7 6", "4 6 7 1 0", "4 1 7 5 3", "4 6 0 2 4"];
let loader;
let model;
let rModel;

const fontInfo = {
    letterWidth: 242,
    letterHeight: 310,
    textureWidth: 1685,
    textureHeight: 1338,
    glyphInfos: {
        '0': { x: 453, y: 1028 },
        '1': { x: 0, y: 3 },
        '2': { x: 452, y: 3 },
        '3': { x: 936, y: 3 },
        '4': { x: 1409, y: 3 },
        '5': { x: 0, y: 515 },
        '6': { x: 453, y: 515 },
        '7': { x: 936, y: 515 },
        '8': { x: 1409, y: 515 },
        '9': { x: 0, y: 1028 }
    }};

describe("Model", function(){
	loader = new OffLoadStrategy(fileArray);
	loader.doLoad();
	model = loader.model;
	model.loadBuffers();

	it("loader should be valid", function() {
    	expect(loader.isValid).toEqual(true);
  	});

  	it("model defined", function() {
    	expect(model).not.toEqual(undefined);
  	});

  	it("model polygons count should be 6", function() {
    	expect(model.polygons.length).toEqual(6);
  	});

  	it("model vertices count should be 8", function() {
    	expect(model.vertices.length).toEqual(8);
  	});

  	it("model bounds should be correct", function() {
    	expect([...model.bounds]).toEqual([-0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
  	});

  	it("model triangles count should be greater than its polygons count", function() {
  		expect(model.trianglesCount).toBeGreaterThan(model.polygons.length);
  	});
})


describe("Selection", function(){
	loader = new OffLoadStrategy(fileArray);
	loader.doLoad();
	model = loader.model;
	model.loadBuffers();
	
	// TODO
	it("selection in range test", function() {
		let sel = new AngleSelectionStrategy(model, 'clean', 1.36, 1.7);
		sel.apply();
    	expect(model.polygons.filter(p => p.isSelected).length).toEqual(6);
  	});

  	it("selection not in range test", function() {
		let sel = new AngleSelectionStrategy(model, 'clean', 1.7, 0);
		sel.apply();
    	expect(model.polygons.filter(p => p.isSelected).length).toEqual(0);
  	});

})

describe("Evaluation", function(){
	loader = new OffLoadStrategy(fileArray);
	loader.doLoad();
	model = loader.model;
	model.loadBuffers();

	let ev = new AngleEvaluationStrategy(model, 'model');
	let res = ev.evaluate();
  // TODO
  it("evaluation test", function() {
    expect(res.list.length).toEqual(24);
  });
  it("evaluation angle value", function() {
    expect(res.list[0]).toEqual(Math.PI/2);
  });

})
