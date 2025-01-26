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

let bold=document.querySelector(".bold");
let italic=document.querySelector(".italic");
let underlined=document.querySelector(".underlined");
let alignment=document.querySelectorAll(".alignment");
let fontSize=document.querySelector(".font-size-prop");
let fontFamily=document.querySelector(".font-family-prop");
let leftAlign=alignment[0];
let middleAlign=alignment[1];
let rightAlign=alignment[2];
let fontColor=document.querySelector(".color-input");
let backgroundcolor=document.querySelector(".bg-color");
let activebg="#d1d8e0";
let deactivebg="#ecf0f1";
let addressbarValue;
bold.addEventListener('click',()=>{
    // to find the active cell
    addressbarValue=addressBar.value;
    let [cell,cellprop]=activeCell(addressbarValue);
    cellprop.bold=!cellprop.bold;     // on the storage change
    cell.style.fontWeight = cellprop.bold ? "bold" : "normal"; //ui change
    bold.style.backgroundColor = cellprop.bold ? activebg : deactivebg; // bold icon bg color
})

italic.addEventListener('click',()=>{
    // to find the active cell
    addressbarValue=addressBar.value;
    let [cell,cellprop]=activeCell(addressbarValue);
    cellprop.italic=!cellprop.italic;     // on the storage change
    cell.style.fontStyle = cellprop.italic ? "italic" : "normal"; //ui change
    italic.style.backgroundColor = cellprop.italic ? activebg : deactivebg;
})


underlined.addEventListener('click',()=>{
    // to find the active cell
    addressbarValue=addressBar.value;
    let [cell,cellprop]=activeCell(addressbarValue);
    cellprop.underlined=!cellprop.underlined;     // on the storage change
    cell.style.textDecoration = cellprop.underlined ? "underline" : "none"; //ui change
    underlined.style.backgroundColor = cellprop.underlined ? activebg : deactivebg;
})

fontSize.addEventListener("change",()=>{
    addressbarValue=addressBar.value;
    let [cell,cellprop]=activeCell(addressbarValue);
    cellprop.fontSize=fontSize.value;
    cell.style.fontSize=cellprop.fontSize + "px";
})

fontFamily.addEventListener("change",()=>{
    addressbarValue=addressBar.value;
    let [cell,cellprop]=activeCell(addressbarValue);
    cellprop.fontFamily=fontFamily.value;
    cell.style.fontFamily=cellprop.fontFamily;
})

fontColor.addEventListener("change",()=>{
    addressbarValue=addressBar.value;
    let [cell,cellprop]=activeCell(addressbarValue);
    cellprop.fontColor=fontColor.value;
    cell.style.color=cellprop.fontColor;
})

backgroundcolor.addEventListener("change",()=>{
    addressbarValue=addressBar.value;
    let [cell,cellprop]=activeCell(addressbarValue);
    cellprop.bgColor=backgroundcolor.value;
    cell.style.backgroundColor=cellprop.bgColor;
})

alignment.forEach((alignitem)=>{
    alignitem.addEventListener("click",(e)=>{
        addressbarValue=addressBar.value;
        let [cell,cellprop]=activeCell(addressbarValue);
        let alignValue=e.target.classList[0];
        cellprop.alignment=alignValue;
        cell.style.textAlign=cellprop.alignment;

        switch(alignValue){
            case "left":
            leftAlign.style.backgroundColor=activebg;
            middleAlign.style.backgroundColor=deactivebg;
            rightAlign.style.backgroundColor=deactivebg;
            break;
            case "center":
                leftAlign.style.backgroundColor=deactivebg;
                middleAlign.style.backgroundColor=activebg;
                rightAlign.style.backgroundColor=deactivebg;
            break;
            case "right":
                leftAlign.style.backgroundColor=deactivebg;
                middleAlign.style.backgroundColor=deactivebg;
                rightAlign.style.backgroundColor=activebg;
            break;
        }
    })

})

// this fn will point out the cell and their cell properties
const activeCell=(addressbarValue)=>{
    let [rid,cid]=decodeAddressBar(addressbarValue);
    // Access cell and storage object i.e two way binding
    let cell=document.querySelector(`.gridboxes[rid="${rid}"][cid="${cid}"]`);
    let cellprop=sheetDB[rid][cid];
    return [cell,cellprop];//cell changes in the ui and cellprop changes in the storagedb
}

// this will decode the cell value like A1 to 00 like that
const decodeAddressBar=(addressbarValue)=>{
    // A1 encode
    let rid=Number(addressbarValue.slice(1) - 1); // 1 to 0
    let cid=Number(addressbarValue.charCodeAt(0)) - 65 //A to 65
    return [rid,cid];
}


const  addListernerstoAttachCellProperties=(cell)=>{
    cell.addEventListener("click",(e)=>{
        addressbarValue=addressBar.value;
        let [rid,cid]=decodeAddressBar(addressbarValue);
        let cellprop=sheetDB[rid][cid];//this is the way of finding out the exact clicked cell value
        //apply cell properties
        cell.style.fontWeight = cellprop.bold ? "bold" : "normal"; 
        cell.style.fontStyle = cellprop.italic ? "italic" : "normal";
        cell.style.textDecoration = cellprop.underlined ? "underline" : "none";
        cell.style.fontSize=cellprop.fontSize + "px";
        cell.style.fontFamily=cellprop.fontfamily;
        cell.style.color=cellprop.fontColor;
        cell.style.backgroundColor=cellprop.bgColor ==="#000000"? "transparent" : cellprop.bgColor;
        cell.style.textAlign=cellprop.alignment;

        // ui changes
        bold.style.backgroundColor = cellprop.bold ? activebg : deactivebg; // bold icon bg color
        italic.style.backgroundColor = cellprop.italic ? activebg : deactivebg;
        underlined.style.backgroundColor = cellprop.underlined ? activebg : deactivebg;
        fontSize.value=  cellprop.fontSize; //so instead of directly updating the ui based on the dropdown we are updating dropdown based on the clicked cell value
        fontFamily.value=cellprop.fontfamily;
        switch(cellprop.alignment){
            case "left":
                leftAlign.style.backgroundColor=activebg;
                middleAlign.style.backgroundColor=deactivebg;
                rightAlign.style.backgroundColor=deactivebg;
            break;
            case "center":
                leftAlign.style.backgroundColor=deactivebg;
                middleAlign.style.backgroundColor=activebg;
                rightAlign.style.backgroundColor=deactivebg;
            break;
            case "right":
                leftAlign.style.backgroundColor=deactivebg;
                middleAlign.style.backgroundColor=deactivebg;
                rightAlign.style.backgroundColor=activebg;
            break;
        }
        let formulaBar=document.querySelector(".formula-bar");
        formulaBar.value=cellprop.formula;
        cell.value=cellprop.value;
    })
}

//update my all navbar icons according to clicked cell
let gridboxes=document.querySelectorAll(".gridboxes");
for(let i=0;i<gridboxes.length;i++){
    addListernerstoAttachCellProperties(gridboxes[i]);
}

 
