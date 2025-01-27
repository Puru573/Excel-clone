// i want to store each cell value in a storage on blur event

for (let i=0;i<rows;i++){
    for(let j=0;j<col;j++){
        let cell=document.querySelector(`.gridboxes[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",()=>{
            let address=addressBar.value;
            let [cell,cellProp]=activeCell(address);
            let enteredData=cell.innerText;
            if(Number(cellProp.value)===Number(enteredData)) return;
            cellProp.value=enteredData;
            removeChildFromParent(cellProp.formula);  // means it remove the dependency of e.g A1 and A2 have the children B1 this fn removes A1 and A2 children
            cellProp.formula="";
            updateChildrenCells(address);
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
        addChildToGraphComponent(inputformula,address);//by by inputformula we will extract parentaddress and by address extract childaddress
        // check forumula is cyclic or not 
        // true => cyclic or false => non-cyclic
        let iscyclic=isGraphCyclic();
        if(iscyclic){
            alert("Your formula is cyclic");
            removeChildFromGraphComponent(inputformula,address);
            return;
        }
         
        let evaluatedVaue=evaluatedFormula(inputformula);
        if(inputformula !== cellProp.formula) removeChildFromParent(cellProp.formula)
        setCellAndCellprop(evaluatedVaue,inputformula,address);
        addChildToParent(inputformula);
        console.log("sheetdb",sheetDB);
        updateChildrenCells(address);
    }
 })

 const addChildToGraphComponent=(formula,address)=>{
    let [crid,ccid]=decodeAddressBar(address);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);  //A1
            if(asciiValue>=65 && asciiValue<=90){
                let [prid,pcid]=decodeAddressBar(encodedFormula[i]);
                graphComponentMatrix[prid][pcid].push([crid,ccid]);//
            }
    }
 }

 const removeChildFromGraphComponent=(formula,address)=>{
    let [crid,ccid]=decodeAddressBar(address);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);  //A1
            if(asciiValue>=65 && asciiValue<=90){
                let [prid,pcid]=decodeAddressBar(encodedFormula[i]);
                // B1 : A1 + 10
                // rid => i , cid => j
                graphComponentMatrix[prid][pcid].pop();//
            }
    }
 }

 const updateChildrenCells=(address)=>{
    let [parentCell,parentCellProp]=activeCell(address);
    let children=parentCellProp.children;
    for(let i=0;i<children.length;i++){
        let childAddress=children[i];
        let [cell,cellProp]=activeCell(childAddress);
        let formula =cellProp.formula;
        let evaluatedValue= evaluatedFormula(formula);
        setCellAndCellprop(evaluatedValue,formula,childAddress);
        updateChildrenCells(childAddress); //base case
    }
 }
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
            // i.e (A1 + A2) in the formula bar and B1 in the address bar so the value get updated on the addressbar value and A1,A2 children consist of B1 on the children arr
            let [parentCell,parentCellProp]=activeCell(brackets);
            parentCellProp.children.push(childAddress);
        }
    }
 }

 const removeChildFromParent=(formula)=>{
    let childAddress=addressBar.value;
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        if(encodedFormula[i]){
            brackets=checkforBrackets(encodedFormula[i]);
            let asciiValue=brackets.charCodeAt(0);  //A1
            if(asciiValue>=65 && asciiValue<=90){
                let [parentCell,parentCellProp]=activeCell(brackets);
                // if addressBar value get changed than we remove the previous stored child in the parent and stored the new one from the addChildToParent 
                let idx=parentCellProp.children.indexOf(childAddress);
                parentCellProp.children.splice(idx,1);
            }
        }  
        else{
            let asciiValue=encodedFormula[i].charCodeAt(0);  //A1
            if(asciiValue>=65 && asciiValue<=90){
                let [parentCell,parentCellProp]=activeCell(encodedFormula[i]);
                // if addressBar value get changed than we remove the previous stored child in the parent and stored the new one from the addChildToParent 
                let idx=parentCellProp.children.indexOf(childAddress);
                parentCellProp.children.splice(idx,1);
            }
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

 const setCellAndCellprop=(evaluatedVaue,inputformula,address)=>{
    let [cell,cellProp]=activeCell(address);
    // saving the addressbarvalue in the ui as well as in the storage in the form of value and formula
    cell.innerText=evaluatedVaue;//ui
    cellProp.value=evaluatedVaue;
    cellProp.formula=inputformula;
 }