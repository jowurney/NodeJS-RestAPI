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
 * Complete the 'getTotalGoals' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. STRING team
 *  2. INTEGER year
 */
const https = require('https');

async function getTotalGoals(team, year) {
    let host = `jsonmock.hackerrank.com`;
    let homePath = `/api/football_matches?year=${year}&team1=${team}`;
    let awayPath = `/api/football_matches?year=${year}&team2=${team}`;

    return await getHomeGoals(`https://${host}${homePath}`, 1)
        + await getAwayGoals(`https://${host}${awayPath}`, 1);

}

async function getHomeGoals(url, page) {
    let pagedUrl = `${url}&page=${page}`;
    let response = await getData(pagedUrl);
    let sum = response.data.reduce((acc, obj) => {
        return acc + Number(obj.team1goals)
    }, 0);

    if (Number(page) < Number(response.total_pages)) {
        sum = sum + await getHomeGoals(url, page + 1);
        return new Promise((resolve, reject) => {
            resolve(sum);
        })
    }

    return new Promise((resolve, reject) => {
        resolve(sum);
    })
}



async function getAwayGoals(url, page) {
    let pagedUrl = `${url}&page=${page}`;
    let response = await getData(pagedUrl);
    let sum = response.data.reduce((acc, obj) => {
        return acc + Number(obj.team2goals)
    }, 0);
 
    if (Number(page) < Number(response.total_pages)) {
        sum = sum + await getAwayGoals(url, page + 1);
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

    const team = readLine();

    const year = parseInt(readLine().trim(), 10);

    const result = await getTotalGoals(team, year);

    ws.write(result + '\n');

    ws.end();
}
