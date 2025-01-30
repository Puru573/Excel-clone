const isGraphCyclicTracePath= async (graphComponentMatrix,cycleResponse)=>{
    let [srcr,srcc]=cycleResponse; //cycle trace actual i and j value
    let visited=[];
    let DFSvisited=[];
    for(let i=0;i<rows;i++){
        let visitedRow=[];
        let DfsVisitedRow=[];
        for(let j=0;j<col;j++){
            visitedRow.push(false);
            DfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        DFSvisited.push(DfsVisitedRow);
    }
    let response=await dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,DFSvisited);
    if(response===true) return Promise.resolve(true);
    return Promise.resolve(false);

}
// for delay and wait
const colorPromise=()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },1000);
    })
}
const dfsCycleDetectionTracePath= async (graphComponentMatrix,srcr,srcc,visited,DFSvisited)=>{
    visited[srcr][srcc]=true;
    DFSvisited[srcr][srcc]=true;
    let cell = document.querySelector(`.gridboxes[rid="${srcr}"][cid="${srcc}"]`);

    cell.style.backgroundColor="lightblue";
    await colorPromise();
    for(let children=0 ; children < graphComponentMatrix[srcr][srcc].length; children++){
        let [nbrr,nbrc]=graphComponentMatrix[srcr][srcc][children];//extracting the cell children
        if(visited[nbrr][nbrc]===false){
            let response=await dfsCycleDetectionTracePath(graphComponentMatrix,nbrr,nbrc,visited,DFSvisited);
            if(response===true){
                cell.style.backgroundColor="transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
            //that means cycle has been detected no need to explore more
        }
        else if(visited[nbrr][nbrc]===true && DFSvisited[nbrr][nbrc]===true){
            //that means cycle has been detected no need to explore more
            let cyclicCell=document.querySelector(`.gridboxes[rid="${nbrr}"][cid="${nbrc}"]`);
            cyclicCell.style.backgroundColor="lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor="transparent";
            await colorPromise();
            cell.style.backgroundColor = "transparent"; 
            await colorPromise();
            return Promise.resolve(true);
        }

    }
    DFSvisited[srcr][srcc]=false;
    cell.style.backgroundColor = "transparent"; //if dfs visited is false blue color change to transparent
    await colorPromise();
    return Promise.resolve(false);
}