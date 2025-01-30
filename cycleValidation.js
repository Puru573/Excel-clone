// storage 2D matrix

let graphComponentMatrix=[];

let collectedGraphComponent=[];
const isGraphCyclic=(graphComponentMatrix)=>{
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
    // this for loop is for make vistedRow and DfsVisitedRow initial value to become false
    for(let i=0;i<rows;i++){
        for(let j=0;j<col;j++){
            if(visited[i][j]===false){
                let response=dfsCycleDetection(graphComponentMatrix,i,j,visited,DFSvisited);
                if(response===true) return [i,j];
            }
        }
    }
    return null;

}

const dfsCycleDetection=(graphComponentMatrix,srcr,srcc,visited,DFSvisited)=>{
    visited[srcr][srcc]=true;
    DFSvisited[srcr][srcc]=true;

    for(let children=0 ; children < graphComponentMatrix[srcr][srcc].length; children++){
        let [nbrr,nbrc]=graphComponentMatrix[srcr][srcc][children];
        if(visited[nbrr][nbrc]===false){
            let response=dfsCycleDetection(graphComponentMatrix,nbrr,nbrc,visited,DFSvisited);
            if(response===true) return true;
            //that means cycle has been detected no need to explore more
        }
        else if(visited[nbrr][nbrc]===true && DFSvisited[nbrr][nbrc]===true){
            //that means cycle has been detected no need to explore more
            return true;
        }

    }
    DFSvisited[srcr][srcc]=false;
    return false;
}