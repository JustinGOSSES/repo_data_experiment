from api import call_api
import json
import os
import pandas as pd


def main():
    # Call the API and get the data
    #data = call_api()
    

    # # Save the data
    # save_data(data)

    # # Check the data
    # check_data()
    print("test")
    
def flattenJSON(inputFilePathJSON, outputFilePathCSV):
    # Load the JSON data
    with open(inputFilePathJSON, 'r') as file:
        data = json.load(file)

    # Flatten the JSON data
    flattened_data = pd.json_normalize(data)

    # Save the flattened data to CSV
    flattened_data.to_csv(outputFilePathCSV, index=False)

flattenJSON('data/nasa_repos.json','data/nasa_repos_flat.csv')

if __name__ == "__main__":
    main()