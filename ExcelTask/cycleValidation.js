// storage 2D matrix

let graphComponentMatrix=[];

for(let i=0;i<rows;i++){
    let rows=[];
    for(let j=0;j<col;j++){
        // why arr? coz of more than one child relation
        rows.push([])
    }
    graphComponentMatrix.push(rows); //this will contain each row
}