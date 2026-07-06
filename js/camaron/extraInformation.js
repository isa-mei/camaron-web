"use strict";

/*--------------------------------------------------------------------------------------
-------------------------------------- INFORMATIONS --------------------------------------
----------------------------------------------------------------------------------------

These functions are for showing extra information about models. Like the result of 
Euler's formula. Also, eventually show degenerates elements, or other useful information.
--------------------------------------------------------------------------------------*/
const resetInformation = () =>{
    const eulerInformation = document.getElementById("euler-info");
    eulerInformation.className = "card information";
    const euler = document.getElementById("euler");
    euler.innerHTML = "";
    const degenerateInformation = document.getElementById("degenerate-info");
    degenerateInformation.className = "card information";
    const info = document.getElementById("degenerate");
    info.innerHTML = "";
}

const showEulerInformation = () => {
    const eulerInformation = document.getElementById("euler-info");
    eulerInformation.classList.remove("information");
    eulerInformation.classList.add("information1");

    const euler = document.getElementById("euler");
    const [V, A, C, Euler] = model.calculateEulerFormula();
    const span = document.createElement("span");
    span.innerHTML = `This model has <strong>${V}</strong> vertices, <strong>${A}</strong> edges and <strong>${C}</strong> faces. <br>
    Then, the result of V - E + F is: <strong>${Euler}</strong>`;
    euler.appendChild(span);
}

const showDegenerateInformation = () => {
    const degenerateInformation = document.getElementById("degenerate-info");
    degenerateInformation.classList.remove("information");
    degenerateInformation.classList.add("information1");

    const info = document.getElementById("degenerate");
    const span = document.createElement("span");
    const extraSpan = document.createElement("span");
    extraSpan.style.fontSize = "0.7rem";
    span.innerHTML = `This model has ${model.degeneratePolygons.length} degenerate polygon. This is related to
    having vertices really close, so the program can not calculate the basis vector related to the polygon.`;
    info.appendChild(span);

    if(model.degeneratePolygons.length < 10){
        span.innerHTML += `<br> <br> The problematic elements are:`;
        const list = document.createElement("ul");
        for (let x in model.degenerateVertices) {
            const listItem = document.createElement("li");
            // listItem.textContent = `- Polygon ID ${x} with this pair of vertices: ${model.degenerateVertices[x].map(A => A.map(v => v.id).join(", ")).join("; ")}`;
            listItem.textContent = `- Polygon ID ${x} with this pair of vertices: `;
            for (let a of model.degenerateVertices[x]) {
                let coord0 = Array.from(a[0].coords).map(v =>Number.isInteger(v) ? v : v.toFixed(2));
                let coord1 = Array.from(a[1].coords).map(v =>Number.isInteger(v) ? v : v.toFixed(2));
                listItem.textContent += `(${a[0].id}, ${a[1].id}) = (${coord0.join(", ")}), (${coord1.join(", ")}) .`;
            }
            list.appendChild(listItem);
        }
        info.appendChild(list);
        extraSpan.innerHTML = `* The coordinates are rounded to 2 decimal places.`;
        extraSpan.style.fontStyle = "italic";
    } else {
        span.innerHTML += `<br> <br> The problematic elements are too many to show.`;
        extraSpan.innerHTML = `* Probably, the dimensions of the vertices are too small.`;
    }
    info.appendChild(extraSpan);
}