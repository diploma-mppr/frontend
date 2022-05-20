import React, {useState} from "react";

export const PointScore: React.FC = () => {

    const [range, setRange] = useState('1');
    const [isOpenFirst, setIsOpenFirst] = useState(false);
    const [isOpenSecond, setIsOpenSecond] = useState(false);

    return(
        <div>
            <h1>Определение весовых коэффициентов методом бальной оценки</h1>

            <div className="border-danger">
                <label htmlFor="customRange" className="form-label p-3" >Показать шаги:</label>
                <input type="range" className="form-range p-3"
                       style={{width: 150, verticalAlign: "middle" }}
                       min="1" max="3" step="1"
                       onChange={(e) =>
                       {
                           setRange(e.target.value);
                           if (e.target.value === "1"){ setIsOpenFirst(false); setIsOpenSecond(false) };
                           if (e.target.value === "2"){ setIsOpenFirst(true); setIsOpenSecond(false) };
                           if (e.target.value === "3"){ setIsOpenFirst(true); setIsOpenSecond(true) };
                       }
                       }
                       value = {range}
                       id="customRange"/>
                {range}
            </div>

            <h3>таблица для ввода значений критериев</h3>
            {printNumArray(criteriasPoints)}

            <h3>вывод суммы всех баллов</h3>
            {countSumPoints(criteriasPoints).toString()}

            <h3>вывод веса одного балла критерия</h3>
            {pointWeight.toString()}

            <h3>вывод значений веса всех критериев</h3>
            {printNumArray(countFinalPoints(criteriasPoints))}

        </div>
    )
}

let criteriasNum: number = 10;

let criteriasPoints: Array<number> = [100, 75, 75, 75, 75, 50, 100, 100, 50, 50];

function printNumArray(numArray: Array<Number>)
{
    let printArray: String = "";
    for (let i = 0; i < numArray.length; i++)
    {
        printArray = printArray + numArray[i].toString() + " ";
    }
    return printArray;
}

function countSumPoints(points: Array<number>)
{
    let sumPoints: number = 0;

    for (let i = 0; i < points.length; i++) {
        sumPoints += points[i];
    }

    return sumPoints;
}

let pointWeight: number = 1/countSumPoints(criteriasPoints);

function countFinalPoints(critPoints: Array<number>)
{
    let sumPoints: number = 0;

    let criteriasFinalPoints: Array<number> = critPoints;

    for (let i = 0; i < critPoints.length; i++) {
        sumPoints += critPoints[i];
    }

    let pointWeight: number = 1/sumPoints;

    for (let i = 0; i < criteriasFinalPoints.length; i++)
    {
        criteriasFinalPoints[i] = critPoints[i] * pointWeight;
    }
    return  criteriasFinalPoints;
}

