import React, {useCallback, useMemo, useRef} from "react";
import {useState} from "react";
import {Hub} from "./Hub";
import {AgGridReact} from "ag-grid-react";
import {ColDef} from "ag-grid-community";

export const WeightedSum: React.FC = () => {

    const [range, setRange] = useState('1');

    return(
        <div className="container">

            <div className="row">
                <div className="col col-3">
                    <h2>Навигация</h2>
                    <Hub/>
                </div>

                <div className="col">
            <h2>Принятие решений с использованием интегрального критерия взвешенной суммы показателей сравнения</h2>

            <div className="border-danger">
                <label htmlFor="customRange" className="form-label p-3" >Показать шаги:</label>
                <input type="range" className="form-range p-3"
                       style={{width: 150, verticalAlign: "middle" }}
                       min="1" max="4" step="1"
                       onChange={(e) =>setRange(e.target.value) }
                       value = {range}
                       id="customRange"/>
                {range}
            </div>

            <h3>Одномерная таблица для весовых коэффициентов</h3>
            {printNumArray(criteriasWeight)}
            <h3>Таблица для ввода значений критериев</h3>
            {printmatrix(critVars)}

                    <Step1/>
                    <div className="p-3"></div>

            <div className={(range >= "2") ? "accordion-body show" : "accordion-body collapse"}>
            <h3>Таблица с нормированными значениями</h3>
            {printmatrix(NormingCrits(critVars))}
            </div>

            <div className={(range >= "3") ? "accordion-body show" : "accordion-body collapse"}>
            <h3>Одномерная таблица с подсчитанной взвешенной суммой для каждого варианта</h3>
            {printNumArray(countWeight(NormingCrits(critVars),criteriasWeight))}
                </div>

            <div className={(range >= "4") ? "accordion-body show" : "accordion-body collapse"}>
            <h3>Вывод номера лучшего варианта</h3>
            {findBestOption(countWeight(NormingCrits(critVars),criteriasWeight))}
            </div>
                </div>
            </div>
        </div>
    )
}


let criteriasNum: number = 10;

let criteriasWeight: Array<number> = [0.157, 0.095,0.095,0.095,0.095,0.05,0.157,0.157,0.05,0.05];

let critVars: Array<Array<number>> = [     [1,	    0.89,	    0.83],
    [1,	    1,	        0.75],
    [1,	    0.89,	    0.83],
    [1,	    0.89,	    0.83],
    [1,	    0.89,	    0.83],
    [0.5,	1,	        1],
    [0.67,	0.83,	    1],
    [0.667,	0.833,	    1],
    [1,	    0.8,	    0.9],
    [1,	    0.9,	    0.9]];

function printmatrix(matrix: Array<Array<number>>) //приводим всю матрицу в строку
{
    let printedMatrix: string = "";

    for (let i = 0; i < matrix.length; i++){
        printedMatrix = printedMatrix + "\n | ";
        for (let j = 0; j < matrix[i].length; j++){
            printedMatrix = printedMatrix + matrix[i][j] + " ";
        }
    }

    return printedMatrix;
}

function printNumArray(numArray: Array<Number>)
{
    let printArray: String = "";
    for (let i = 0; i < numArray.length; i++)
    {
        printArray = printArray + numArray[i].toString() + " ";
    }
    return printArray;
}

function NormingCrits (matrix: Array<Array<number>>){
    let maxPoint: number;
    for (let i = 0; i < matrix.length; i++)
    {
        maxPoint = 0;
        for (let j = 0; j < matrix[i].length; j++)
        {
            if (matrix[i][j] > maxPoint)
            {
                maxPoint = matrix[i][j];
            }
        }

        for (let j = 0; j < matrix[i].length; j++)
        {
            matrix[i][j] = matrix[i][j]/maxPoint;
        }
    }
    return matrix;
}




function countWeight (matrix: Array<Array<number>>, criteriasWeight: Array<number>)
{
    let totalPoints: Array<number> = [0,0,0]

    for (let i = 0; i < matrix.length; i++)
    {
        for (let j = 0; j < matrix[i].length; j++)
        {
            totalPoints[j] = totalPoints[j] + criteriasWeight[i]*matrix[i][j];
        }
    }
    return totalPoints;
}


function findBestOption(pointArray: Array<number>) {
    let bestOption: number = 0;

    for (let i = 0; i < pointArray.length; i++) {
        if (pointArray[i] > pointArray[bestOption]) {
            bestOption = i;
        }
    }

    return bestOption;
}

export const Step1 = () => {
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({ width: '78%', height: '130%'}), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const onBtExport = useCallback(() => {
        gridRef.current!.api.exportDataAsCsv();
    }, []);


    const [rowData, setRowData] = useState<any[]>(
        [
                    {"crits":"Критерий 1", "weights": 0.157, "var1": 1,"var2": 0.89, "var3": 0.83},
                    {"crits":"Критерий 2", "weights": 0.095, "var1": 1,"var2": 1, "var3": 0.75},
                    {"crits":"Критерий 2", "weights": 0.095, "var1": 1,"var2": 0.89, "var3": 0.83},
                    {"crits":"Критерий 2", "weights": 0.095, "var1": 1,"var2": 0.89, "var3": 0.83},
                    {"crits":"Критерий 2", "weights": 0.095, "var1": 1,"var2": 0.89, "var3": 0.83},
                    {"crits":"Критерий 2", "weights": 0.05,  "var1": 0.5,"var2": 1, "var3": 1},
                    {"crits":"Критерий 2", "weights": 0.157, "var1": 0.67,"var2": 0.83, "var3": 1},
                    {"crits":"Критерий 2", "weights": 0.157, "var1": 0.667,"var2": 0.833, "var3": 0},
                    {"crits":"Критерий 2", "weights": 0.05,  "var1": 1,"var2": 0.8, "var3": 0.9},
                    {"crits":"Критерий 3", "weights": 0.05,  "var1": 1,"var2": 0.9, "var3": 0.9}]
    );

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'crits', headerName: "Критерий" },
        { field: 'weights', headerName: "Вес критерия" },
        { field: 'var1', headerName: "Вариант 1" },
        { field: 'var2', headerName: "Вариант 2" },
        { field: 'var3', headerName: "Вариант 3" },
    ]);

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            editable: true,
            width: 140
        };
    }, []);


    return (
        <div style={containerStyle}>

            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                ></AgGridReact>
            </div>
            <button className="btn btn-primary p-1"
                    onClick={onBtExport}
            >
                Export to Excel
            </button>

        </div>
    );
};