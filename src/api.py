import requests
import os
import json


# https://repos.ecosyste.ms/api/v1/hosts/github/owners/nasa/repositories?page=3&per_page=50'


def call_api(orgName='nasa'):
    EcoSysOwnerRepos_baseURL = "https://repos.ecosyste.ms/api/v1/hosts/github/owners/"
    owner = "nasa"
    EcoSysOwnerRepos_secondHalf = "/repositories?"
    EcoSysOwnerRepos_paging = "page=1&per_page=50"

    url = f'{EcoSysOwnerRepos_baseURL}{orgName}{EcoSysOwnerRepos_secondHalf}{EcoSysOwnerRepos_paging}'
    
    data = []
    page = 1
    
    try:
        while True:
            response = requests.get(url)
            response.raise_for_status()
            page_data = response.json()
            
            if not page_data:
                break
            
            data.extend(page_data)
            page += 1
            EcoSysOwnerRepos_paging = f"page={page}&per_page=50"
            url = f'{EcoSysOwnerRepos_baseURL}{orgName}{EcoSysOwnerRepos_secondHalf}{EcoSysOwnerRepos_paging}'
            
        # Process the data
        
        # Save JSON data to the data folder
        file_path = os.path.join("data", f"{orgName}_repos.json")
        with open(file_path, "w") as file:
            json.dump(data, file)
        
    except requests.exceptions.RequestException as e:
        print(f'Request failed with error: {e}')
        
    print("data = ", data)
    return data
