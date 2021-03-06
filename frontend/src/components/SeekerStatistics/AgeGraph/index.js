import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import dayjs from "dayjs";
import 'dayjs/locale/es'
import styled from "styled-components";
import {BaseChartWrapper} from "../../../style/GlobalWrappers";
import {ChartTitle} from "../../../style/GlobalTitles";


const getLabels = (amountOfDays, format) => {
    let labels = []
    for (let i = 0; i < amountOfDays; i++) {
        labels.push(dayjs().subtract(i, 'day').format(format))
    }
    return labels.reverse()
}

// useEffect(() => {
//     if (statistics) {
//         console.log(dayjs(statistics[0].created).format('DD/MM/YYYY'))
//         console.log(dayjs(statistics[0].created).subtract(1, 'day').format('DD/MM/YYYY'))
//         // console.log(dayjs(statistics[0].created))
//     }
// }, [statistics])

// getLabels(7, 'dddd')

const filterAll = (arr, min, max) => {
    return arr.filter(el => el.age >= min && el.age <= max).length
}
const filterMale = (arr, min, max) => {
    return arr.filter(el => el.age >= min && el.age <= max && el.gender === "M").length
}
const filterFemale = (arr, min, max) => {
    return arr.filter(el => el.age >= min && el.age <= max && el.gender === "F").length
}
const getAgeData = (func, stats) => {
    return [
        func(stats, 18, 19),
        func(stats, 20, 29),
        func(stats, 30, 39),
        func(stats, 40, 49),
        func(stats, 50, 59),
        func(stats, 60, 69),
        func(stats, 70, 150)
    ]
}

const Wrapper = styled(BaseChartWrapper)`
  grid-area: age;
`

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [
            {
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true
                },
                gridLines: {
                    display: false
                }
            }
        ],
        xAxes: [
            {
                gridLines: {
                    display: false
                }
            }
        ]
    }
}


const initialState = {
    labels: ['18-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
    datasets: [
        {
            label: 'Blood Donation Applicants',
            fill: true,
            backgroundColor: 'rgba(17,152,75,0.44)',
            borderColor: '#11984b',
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: 'Male Applicants',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'rgba(54,162,235,0.58)',
            borderColor: '#36A2EB',
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: 'Female Applicants',
            fill: true,
            backgroundColor: 'rgba(255,206,86,0.47)',
            borderColor: '#FFCE56',
            data: [0, 0, 0, 0, 0, 0, 0]
        },

    ]
};

const AgeGraph = ({statistics}) => {

    const [state, setState] = useState(initialState);


    useEffect(() => {
        if (statistics) {
            const newState = {...state}
            newState.datasets[0].data = getAgeData(filterAll, statistics)
            newState.datasets[1].data = getAgeData(filterMale, statistics)
            newState.datasets[2].data = getAgeData(filterFemale, statistics)
            setState(newState)
        }
    }, [statistics])


    return (
        <Wrapper>
            <ChartTitle>Donations By Age Group</ChartTitle>
            {state ? <Line
                data={state}
                options={options}
            /> : null}
        </Wrapper>)
}

export default AgeGraph