const axios = require('axios');
const fs = require('fs');
const path = require('path');


async function call_api_js(orgName = 'nasa') {
    const EcoSysOwnerRepos_baseURL = 'https://repos.ecosyste.ms/api/v1/hosts/github/owners/';
    const owner = 'nasa';
    const EcoSysOwnerRepos_secondHalf = '/repositories?';
    let EcoSysOwnerRepos_paging = 'page=1&per_page=50';

    let url = `${EcoSysOwnerRepos_baseURL}${orgName}${EcoSysOwnerRepos_secondHalf}${EcoSysOwnerRepos_paging}`;

    const data = [];
    let page = 1;

    try {
        while (true) {
            const response = await axios.get(url);
            const page_data = response.data;

            if (!page_data.length) {
                break;
            }

            data.push(...page_data);
            page += 1;
            EcoSysOwnerRepos_paging = `page=${page}&per_page=50`;
            url = `${EcoSysOwnerRepos_baseURL}${orgName}${EcoSysOwnerRepos_secondHalf}${EcoSysOwnerRepos_paging}`;
        }

        // Process the data

        // Save JSON data to the data folder
        const file_path = path.join('data', `${orgName}_repos.json`);
        fs.writeFileSync(file_path, JSON.stringify(data));

    } catch (error) {
        console.error(`Request failed with error: ${error.message}`);
    }

    console.log('data = ', data);
    return data;
}


call_api_js('nasa-jpl');