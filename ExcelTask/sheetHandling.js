let addSheetBtn=document.querySelector(".add-icon");
let sheetCont =document.querySelector(".sheets-folder-cont");
let activeSheetColor="#ced6e0";
addSheetBtn.addEventListener("click",()=>{
    let sheet=document.createElement("div");
    sheet.setAttribute("class","sheet-folder");

    let allSheetFolder=document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id",allSheetFolder.length);

    sheet.innerHTML=`
    <div class= sheet-content>
    sheet${allSheetFolder.length + 1}
    </div>
    `
    sheetCont.appendChild(sheet);
    // DB of sheets 
    createSheetDB();
    createdGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
        if(e.button!==2) return;
        // 0 is left click , 1 is scroll and 2 is right click
        let allSheetFolders=document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length===1){
            alert("you need to have atleash one sheet");
            return;
        }
        let response=confirm("your sheet will be remove permanently Are you sure?");
        if(response===false) return;
        let sheetIdx=Number(sheet.getAttribute("id"));
        // db removal
        collectedSheetDB.splice(sheetIdx,1);
        collectedGraphComponent.splice(sheetIdx,1);
        // UI
        handleSheetUIRemoval(sheet);
        // bydefault assign db to sheet 1 
        sheetDB=collectedSheetDB[0];
        graphComponentMatrix=collectedGraphComponent[0];
        handleSheetProperties();
    })
}
function handleSheetDb(sheetIdx){
    sheetDB=collectedSheetDB[sheetIdx];
    graphComponentMatrix=collectedGraphComponent[sheetIdx];
}

function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent=allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText=`sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    allSheetFolders[0].style.backgroundColor=activeSheetColor;
    // on removal the first sheet will get highlighted and the index will get updated
}
function handleSheetUI(sheet){
    let allSheetFolder=document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolder.length;i++){
        allSheetFolder[i].style.backgroundColor="transparent";
    }
    sheet.style.backgroundColor=activeSheetColor;
}

function handleSheetActiveness(sheet){
    sheet.addEventListener("click",(e)=>{
        let sheetIdx=Number(sheet.getAttribute("id"));
        handleSheetDb(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}

function createSheetDB(){
    let sheetDB=[];
    for(let i=0;i<rows;i++){
        let subarr=[];
        for(let j=0;j<col;j++){
            let cellProp={
                bold:false,
                italic:false,
                underline:false,
                alignment:"left",
                fontfamily:"monospace",
                fontSize:14,
                fontColor:"#000000",
                bgColor:"#000000",  //just for identification purpose
                value:"",
                formula:"",
                children:[]
            }
            subarr.push(cellProp);
        }
        sheetDB.push(subarr);
    }
    collectedSheetDB.push(sheetDB);  //put all the main arr into collectedsheetdb
}

function handleSheetProperties(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<col;j++){
            let cell=document.querySelector(`.gridboxes[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // by default click on first cell
    let firstcell=document.querySelector(".gridboxes");
    firstcell.click();
}

function createdGraphComponentMatrix(){
    let graphComponentMatrix=[];

    for(let i=0;i<rows;i++){
        let rows=[];
        for(let j=0;j<col;j++){
            // why arr? coz of more than one child relation
            rows.push([])  
        }
        graphComponentMatrix.push(rows); //this will contain each row
    }
    collectedGraphComponent.push(graphComponentMatrix); //put all rows cyclic relation again into an larger arr

}