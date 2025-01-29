let ctrlKey;
let borderColor="#1abc9c";
let copybtn=document.querySelector(".copy");
let pastebtn=document.querySelector(".paste");
document.addEventListener("keydown",(e)=>{
    ctrlKey=e.ctrlKey;
})

document.addEventListener("keyup",(e)=>{
    ctrlKey=e.ctrlKey;
}) //we use keydown and keyup when we need to continue track to our keyboard event

for(let i=0;i<rows;i++){
    for(let j=0;j<col;j++){
        let cell=document.querySelector(`.gridboxes[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}
let rangeStorage=[];
function handleSelectedCells(cell){
    cell.addEventListener("click",()=>{
        if(!ctrlKey) return;
        if(rangeStorage.length >= 2){
            handlesSelectedCellsUI(rangeStorage);
            rangeStorage=[];
        }
        cell.style.border= "3px solid #1abc9c";
        let rid=Number(cell.getAttribute("rid"));
        let cid=Number(cell.getAttribute("cid"));
        rangeStorage.push([rid,cid]);
        console.log("rangeStorage",rangeStorage);
    })
}

function handlesSelectedCellsUI(rangeStorage){
    for(let i=0;i<rangeStorage.length;i++){
        let cell=document.querySelector(`.gridboxes[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border= " 1px solid lightgrey";
    }
}
let copyData=[];
// copy logic
copybtn.addEventListener("click",(e)=>{
    if(rangeStorage.length < 2) return;
    copyData=[];  //when you copy another data the first Data which has been copied get removed(start with the new one buddy!!)
    let stRow=rangeStorage[0][0];
    let stCol=rangeStorage[0][1];
    let endRow=rangeStorage[1][0];
    let endCol=rangeStorage[1][1];
    for(let i=stRow ;i<=endRow;i++){
        let copyRow=[];
        for(let j=stCol ;j<=endCol;j++){  //it will consist of a box which have all the details of properties i.e applied on the cell
            let cellProp=sheetDB[i][j];//consist of properties
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    console.log("copyDataaa",copyData);
})
//paste logic
// r => copydata row
// c => copydata cell

pastebtn.addEventListener("click",(e)=>{
    let address=addressBar.value;
    let [trid,tcid]=decodeAddressBar(address);
    let rowDiff= Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff= Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    for(let i=trid,r=0; i<= trid + rowDiff; i++,r++){
        for (let j=tcid,c=0 ;j<= tcid + colDiff ;j++,c++){
            let cell=document.querySelector(`.gridboxes[rid="${i}"][cid="${j}"]`);
            if(!cell) continue;
            //db
            let data=copyData[r][c]; //this is the copy data storage
            let cellprop=sheetDB[i][j];//this is the main storage;
            cellprop.value=data.value;
            cellprop.bold=data.bold;
            cellprop.italic=data.italic;
            cellprop.underline=data.underline;
            cellprop.fontSize=data.fontSize;
            cellprop.fontFamily=data.fontFamily;
            cellprop.fontColor=data.fontColor;
            cellprop.bgColor=data.bgColor;
            cellprop.alignment=data.alignment;

            // the above code will change the main storage according to the copied data;
            // ui 
            cell.click(); //on click the changes will show in the ui

        }
    }
})





