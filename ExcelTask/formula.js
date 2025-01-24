// i want to store each cell value in a storage on blur event

for (let i=0;i<rows;i++){
    for(let j=0;j<col;j++){
        let cell=document.querySelector(`.gridboxes[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",()=>{
            let address=addressBar.value;
            let [cell,cellProp]=activeCell(address);
            let enteredData=cell.innerText;
            cellProp.value=enteredData;
        })
    }
}
const checkforBrackets=(encodedFormula)=>{
    let latestString="";
    let checkForBrackets=encodedFormula.split("");
    for(let i=0;i<checkForBrackets.length;i++){
        if(checkForBrackets[i]==="(" || checkForBrackets[i]===")"){
            checkForBrackets[i]="";
        }          
    }
    return latestString+=checkForBrackets.join("");
}


// when anyone writes formula in the formula bar i want to store them in the db and show them in the ui
 let formulabar=document.querySelector(".formula-bar");
 let inputformula;
 formulabar.addEventListener("keydown",(e)=>{
    inputformula=formulabar.value;
    if(e.key==="Enter" && inputformula){
        // if change in formula break old p-c relationship,evaluate new formula, and new pc relation
        let address=addressBar.value;
        let [cell,cellProp]=activeCell(address);
        let evaluatedVaue=evaluatedFormula(inputformula);
        if(inputformula !== cellProp.formula) removeChildFromParent(cellProp.formula)
        setCellAndCellprop(evaluatedVaue,inputformula);
        addChildToParent(inputformula);
    }
 })

 const addChildToParent=(inputformula)=>{
    let childAddress=addressBar.value;
    let encodedFormula=inputformula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let latestFormula =checkforBrackets(encodedFormula[i]);
        let asciiValue=latestFormula.charCodeAt(0);  //A1
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp]=activeCell(latestFormula);
            parentCellProp.children.push(childAddress);
            console.log("parentCellProppp",parentCellProp);
        }
    }
 }

 const removeChildFromParent=(formula)=>{
    let childAddress=addressBar.value;
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);  //A1
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp]=activeCell(encodedFormula[i]);
            let idx=parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
 }

 const evaluatedFormula=(formula)=>{
    let encodedFormula=formula.split(" "); //"A1 + 10"
    let latestFormula="";
    for(let i=0;i<encodedFormula.length;i++){
       latestFormula+=checkforBrackets(encodedFormula[i]);

        let asciiValue=latestFormula.charCodeAt(0);  //A1
        if(asciiValue>=65 && asciiValue<=90){
            let [cell,cellProp]=activeCell(latestFormula);
            latestFormula=cellProp.value; //storage value of that clicked cell i.e A1
        }
    }
    console.log("latestString",latestFormula)

    let decodedFormula=latestFormula;
        return eval(decodedFormula); //is going me to give the evaluated result of any expression }
 }

 const setCellAndCellprop=(evaluatedVaue,inputformula)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activeCell(address);
    cell.innerText=evaluatedVaue;//ui
    cellProp.value=evaluatedVaue;
    cellProp.formula=inputformula;
 }