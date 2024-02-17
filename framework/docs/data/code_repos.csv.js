import * as d3 from 'd3';

async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        d3.csv(filePath)
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
}


const repos = await readCSV("./data/all_orgs_merged_20240120.csv");

process.stdout.write(JSON.stringify(repos));