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


// when anyone writes formula in the formula bar i want to store them in the db and show them in the ui
 let formulabar=document.querySelector(".formula-bar");
 let inputformula;
 let latestFormula="";

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
 const checkforBrackets=(encodedFormula)=>{
    let brackets;
   brackets= encodedFormula.split("");
    for(let j=0;j<brackets.length;j++){
        if(brackets[j] ==="(" || brackets[j]===")"){
            brackets[j]="";
        }
    }
    return brackets.join("");
 }

 const addChildToParent=(inputformula)=>{
    let childAddress=addressBar.value;
    let encodedFormula=inputformula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        if(encodedFormula[i]){
            brackets=checkforBrackets(encodedFormula[i]);
        }  
        let asciiValue=brackets.charCodeAt(0);  //A1
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp]=activeCell(brackets);
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
    let nobrackets;
    let encodedFormula=formula.split(" "); //"A1 + 10"
    let updatevalue=[];
    for(let i=0;i<encodedFormula.length;i++){
    if(encodedFormula[i]){
        nobrackets=checkforBrackets(encodedFormula[i]);
    }     
        let asciiValue=nobrackets.charCodeAt(0);  //A1
        if(asciiValue>=65 && asciiValue<=90){
            let [cell,cellProp]=activeCell(nobrackets);
            nobrackets=cellProp.value; //storage value of that clicked cell i.e A1
        }
        updatevalue.push(nobrackets);
    }
    // console.log("latestString",latestFormula)

    let decodedFormula= updatevalue.join("");
        return eval(decodedFormula); //is going me to give the evaluated result of any expression }
 }

 const setCellAndCellprop=(evaluatedVaue,inputformula)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activeCell(address);
    cell.innerText=evaluatedVaue;//ui
    cellProp.value=evaluatedVaue;
    cellProp.formula=inputformula;
 }