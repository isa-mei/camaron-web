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
}

const showEulerInformation = () => {
    const eulerInformation = document.getElementById("euler-info");
    eulerInformation.classList.remove("information");
    eulerInformation.classList.add("information1");

    const euler = document.getElementById("euler");
    const [V, A, C, Euler] = model.calculateEulerFormula();
    const span = document.createElement("span");
    span.innerHTML = `This model has ${V} vertices, ${A} edges and ${C} faces. <br>
    Then, the result of V - E + F is: ${Euler}`;
    euler.appendChild(span);
}