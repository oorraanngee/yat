
export type GridCell = { char: string; bb?: boolean; bl?: boolean; bt?: boolean; br?: boolean };

export const renderGridObj = (rows: number, cols: number): GridCell[][] => 
    Array.from({length: rows}, () => Array.from({length: cols}, () => ({ char: '' })));

export const calcAddition = (a: any, b: any, sign: string) => {
    let nA = Number(a), nB = Number(b);
    if(!Number.isInteger(nA) || !Number.isInteger(nB)) return [[{char:a},{char:sign},{char:b},{char:'='},{char:String(nA + (sign==='-'?-nB:nB))}]];
    const sA = String(a), sB = String(b), sR = String(nA + (sign==='-'?-nB:nB));
    const cols = Math.max(sA.length, sB.length + 2, sR.length);
    const grid = renderGridObj(3, cols);
    for (let i = 0; i < sA.length; i++) grid[0][cols - sA.length + i].char = sA[i];
    grid[1][cols - sB.length - 2].char = sign;
    for (let i = 0; i < sB.length; i++) grid[1][cols - sB.length + i].char = sB[i];
    for (let i = cols - sB.length - 2; i < cols; i++) grid[1][i].bb = true;
    for (let i = 0; i < sR.length; i++) grid[2][cols - sR.length + i].char = sR[i];
    return grid;
};

export const calcMult = (a: any, b: any) => {
    let nA = Number(a), nB = Number(b);
    if(!Number.isInteger(nA) || !Number.isInteger(nB)) return [[{char:a},{char:'*'},{char:b},{char:'='},{char:String(nA*nB)}]];
    const sA = String(a), sB = String(b), sR = String(nA * nB);
    const cols = Math.max(sA.length, sB.length + 2, sR.length);
    const rowCount = 2 + (sB.length > 1 ? sB.length + 1 : 1);
    const grid = renderGridObj(rowCount, cols);
    for (let i=0; i<sA.length; i++) grid[0][cols - sA.length + i].char = sA[i];
    grid[1][cols - sB.length - 2].char = '×';
    for (let i=0; i<sB.length; i++) grid[1][cols - sB.length + i].char = sB[i];
    for (let i=cols - Math.max(sA.length, sB.length + 2); i<cols; i++) grid[1][i].bb = true;
    if (sB.length > 1) {
        let rIdx = 2;
        for (let i = sB.length - 1; i >= 0; i--) {
            let pStr = String(nA * Number(sB[i]));
            let shift = sB.length - 1 - i;
            for(let j=0; j<pStr.length; j++) grid[rIdx][cols - shift - pStr.length + j].char = pStr[j];
            if (i === 0) for(let j=cols - sR.length; j<cols; j++) grid[rIdx][j].bb = true;
            rIdx++;
        }
        for (let i=0; i<sR.length; i++) grid[rowCount-1][cols - sR.length + i].char = sR[i];
    } else {
        for (let i=0; i<sR.length; i++) grid[2][cols - sR.length + i].char = sR[i];
    }
    return grid;
};

export const calcDiv = (a: any, b: any) => {
    let nA = Number(a), nB = Number(b);
    if(!Number.isInteger(nA) || !Number.isInteger(nB) || nB===0 || nA<0 || nB<0) return [[{char:a},{char:'/'},{char:b},{char:'='},{char:nB?String(nA/nB):'∞'}]];
    const sA = String(a), sB = String(b), sQ = String(Math.floor(nA/nB));
    const leftCols = sA.length + 1;
    const rightMax = Math.max(sB.length, sQ.length);
    const cols = leftCols + rightMax;
    let rowsArr: GridCell[][] = [];
    let r0 = Array.from({length: cols}, () => ({ char: '' } as GridCell));
    for (let i=0; i<sA.length; i++) r0[i] = { char: sA[i] };
    for (let i=0; i<sB.length; i++) r0[sA.length + i] = { char: sB[i], bl: i===0 };
    rowsArr.push(r0);
    let cStr = sA[0]; let idx = 0;
    while(Number(cStr) < nB && idx < sA.length - 1) { idx++; cStr+=sA[idx]; }
    let fSub = Math.floor(Number(cStr)/nB) * nB;
    let sSub = String(fSub);
    let r1 = Array.from({length: cols}, () => ({ char: '' } as GridCell));
    let subStart = idx - sSub.length + 1;
    if (subStart > 0) r1[subStart - 1] = { char: '-' };
    for(let i=0; i<sSub.length; i++) r1[subStart + i] = { char: sSub[i], bb: true };
    for(let i=0; i<sQ.length; i++) r1[sA.length + i] = { char: sQ[i], bl: i===0, bt: true };
    rowsArr.push(r1);
    let cDiff = Number(cStr) - fSub;
    for(let i=idx+1; i<sA.length; i++) {
        let cValStr = (cDiff === 0 ? '' : String(cDiff)) + sA[i];
        let cValNum = Number(cValStr);
        let offsetV = i - cValStr.length + 1;
        let rV = Array.from({length: cols}, () => ({ char: '' } as GridCell));
        for(let j=0; j<cValStr.length; j++) rV[offsetV + j] = { char: cValStr[j] };
        rowsArr.push(rV);
        let subVal = Math.floor(cValNum/nB) * nB;
        let sSub2 = String(subVal);
        let rSub2 = Array.from({length: cols}, () => ({ char: '' } as GridCell));
        let subStart2 = i - sSub2.length + 1;
        if(subStart2 > 0) rSub2[subStart2 - 1] = { char: '-' };
        for(let j=0; j<sSub2.length; j++) rSub2[subStart2 + j] = { char: sSub2[j], bb: true };
        rowsArr.push(rSub2);
        cDiff = cValNum - subVal;
    }
    let rF = Array.from({length: cols}, () => ({ char: '' } as GridCell));
    let sF = String(cDiff);
    let offsetF = sA.length - sF.length;
    for(let i=0; i<sF.length; i++) rF[offsetF + i] = { char: sF[i] };
    rowsArr.push(rF);
    return rowsArr;
};
