let downloadbtn=document.querySelector(".download");
let uploadbtn=document.querySelector(".upload");


// downloadbtn logic
downloadbtn.addEventListener("click",(e)=>{
    let jsonData=JSON.stringify([sheetDB,graphComponentMatrix]);
    let file=new Blob([jsonData],{type:"application/json"});//blob gives me a url of download
    let a=document.createElement("a");
    a.href=URL.createObjectURL(file);
    a.download="sheetData.json";
    a.click();
});

uploadbtn.addEventListener("click",(e)=>{
    let input=document.createElement("input");
    input.setAttribute("type","file");
    input.click();
    // by the help of the above code the browse window will get open
    input.addEventListener("change",(e)=>{
        let fr=new FileReader();
        let files=input.files;
        let fileObj=files[0];
        fr.readAsText(fileObj);
        fr.addEventListener("load",(e)=>{
            let readSheetData=JSON.parse(fr.result);
            // basic sheet with default data will be created
            addSheetBtn.click();
            // sheetDB , graphComponent
            sheetDB=readSheetData[0];
            graphComponentMatrix=readSheetData[1];

            collectedSheetDB[collectedSheetDB.length-1]=sheetDB;  //let considered there will be 2 page so data will always appear on the new page i.e 1  if there are 3 page data will always appear on the page 2
            collectedGraphComponent[collectedGraphComponent.length-1]=graphComponentMatrix;
            handleSheetProperties();
            //when page get added after addSheetBtn we nedd to manually click on the each cell with the help of handleSheetProperties
        })
    })
    
})