let addresscolcont=document.querySelector(".address-col-cont");
let addressrowcont=document.querySelector(".address-row-cont");
let cellCont =document.querySelector(".cells-cont");
let addressBar=document.querySelector(".address-bar");
let col=26; //this col represent rows
let rows=100; //this rows will represent col
for(let i=0;i <rows ;i++){
    let addresscol=document.createElement("div");
    addresscol.setAttribute("class","addresscol");
    addresscol.innerText=i+1;
    addresscolcont.appendChild(addresscol);
}

for(let i=0;i<col;i++){
    let addressrow=document.createElement("div");
    addressrow.setAttribute("class","addressrow");
    let num = String.fromCharCode(97 + i);
    addressrow.innerHTML=num.toUpperCase();
    addressrowcont.appendChild(addressrow);
}


// grid lines
for(let i=0 ; i<rows;i++){
    let gridLines=document.createElement("div");
    gridLines.setAttribute("class","gridLines");
    for(let j=0; j<col ;j++){
        let gridboxes=document.createElement("div");
        gridboxes.setAttribute("class","gridboxes");
        gridboxes.setAttribute("contenteditable","true");
        gridboxes.setAttribute("spellcheck","false");
        // for cell and storage identification
        gridboxes.setAttribute("rid",i);
        gridboxes.setAttribute("cid",j);
        gridLines.appendChild(gridboxes);
    }
    cellCont.appendChild(gridLines);
}
//fill the value of latest gridboxes into addressbar
let allgridboxes=document.querySelectorAll(".gridboxes");
    allgridboxes.forEach((gridbox,index)=>{
        gridbox.addEventListener("click",()=>{
            let rowIndex=Math.floor(index/col)+1;
            let colIndex=String.fromCharCode(65 + (index % col));
            addressBar.value=`${colIndex}${rowIndex}`
        })
    })
    // so the index value is like 0,1,2 upto 99 and addressbar value is set according to that





