#### import python packages
import json
import os
import pandas as pd
import argparse
#### These are python functions defined in other local files
from api import call_api
from processData import flattenJSON, mergeMultipleOrgCSV

def display_data(data):
    # Add your data displaying logic here
    pass

def main():
    parser = argparse.ArgumentParser(description='Python script to interact with API.')
    parser.add_argument('--orgName', type=str, help='Name of the organization')
    parser.add_argument('--function', type=str, help='Function to execute')
    parser.add_argument('--inputFilePath', type=str, help='path to file used as input to function')
    parser.add_argument('--outputFilePath', type=str, help='path to file used as output to function')
    parser.add_argument('--folderPathToLookForCSVsToMerge', type=str, help='path to file used as output to function')

    args = parser.parse_args()

    if args.function == 'call_api':
        # Calls the Ecosyste.ms API and get the high level repository metrics for a single GitHub organization
        data = call_api(args.orgName)
        
    elif args.function == 'flattenJSON':
        # Flattens the JSON data into a flat CSV
        flattenJSON(args.inputFilePath, args.outputFilePath)
    
    elif args.function == 'mergeMultipleOrgCSV':
        # merges multiple CSVs in a folder into a single CSV file
        mergeMultipleOrgCSV(args.folderPathToLookForCSVsToMerge, args.outputFilePath)
        
    else:
        print(f'Unknown function: {args.function}')


if __name__ == "__main__":
    main()