'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function (inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function () {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}



/*
 * Complete the 'getWinnerTotalGoals' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. STRING competition
 *  2. INTEGER year
 */
const https = require('https');
async function getWinnerTotalGoals(competition, year) {
    let host = `jsonmock.hackerrank.com`;
    let compPath = `/api/football_competitions?name=${competition}&year=${year}`;

    let winnerData = await getData(encodeURI(`https://${host}${compPath}`));
    let team = winnerData.data[0].winner;

    let homePath = `/api/football_matches?competition=${competition}&year=${year}&team1=${team}`;
    let awayPath = `/api/football_matches?competition=${competition}&year=${year}&team2=${team}`;

    let totalGoal = await getTeam1Goals(encodeURI(`https://${host}${homePath}`), 1);
    totalGoal += await getTeam2Goals(encodeURI(`https://${host}${awayPath}`), 1)
    return totalGoal;

}

async function getTeam1Goals(url, page) {
    let pagedUrl = `${url}&page=${page}`;
    let response = await getData(pagedUrl);
    let sum = response.data.reduce((acc, obj) => {
        return acc + Number(obj.team1goals)
    }, 0);

    if (Number(page) < Number(response.total_pages)) {
        sum = sum + await getTeam1Goals(url, page + 1);
        return new Promise((resolve, reject) => {
            resolve(sum);
        })
    }

    return new Promise((resolve, reject) => {
        resolve(sum);
    })
}

async function getTeam2Goals(url, page) {
    let pagedUrl = `${url}&page=${page}`;
    let response = await getData(pagedUrl);
    let sum = response.data.reduce((acc, obj) => { return acc + Number(obj.team2goals) }, 0);


    if (Number(page) < Number(response.total_pages)) {
        sum = sum + await getTeam2Goals(url, page+1);
        return new Promise((resolve, reject) => {
            resolve(sum);
        })
    }
    

    return new Promise((resolve, reject) => {
        resolve(sum);
    })
}


async function getData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            reject(err);
        });
    })
}

async function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const competition = readLine();

    const year = parseInt(readLine().trim(), 10);

    const result = await getWinnerTotalGoals(competition, year);

    ws.write(result + '\n');

    ws.end();
}
