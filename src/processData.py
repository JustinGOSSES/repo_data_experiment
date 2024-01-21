import json
import os
import pandas as pd

def flattenJSON(inputFilePathJSON, outputFilePathCSV):
    # Load the JSON data
    with open(inputFilePathJSON, 'r') as file:
        data = json.load(file)

    # Flatten the JSON data
    flattened_data = pd.json_normalize(data)

    # Save the flattened data to CSV
    flattened_data.to_csv(outputFilePathCSV, index=False)


def mergeMultipleOrgCSV(filePathToLookForCSVs, outputFilePathCSV):
    """
    Merge multiple CSV files into a single CSV file.

    Args:
        filePathToLookForCSVs (str): The path to look for CSV files.
        outputFilePathCSV (str): The path to save the merged CSV file.

    Returns:
        None
    """
    # Get all CSV files in the directory
    csv_files = [file for file in os.listdir(filePathToLookForCSVs) if file.endswith('.csv')]

    # Check if there are any CSV files
    if not csv_files:
        print("No CSV files found in the directory.")
        return

    # Read the first CSV file to get the column headers
    first_csv_file = os.path.join(filePathToLookForCSVs, csv_files[0])
    first_csv_data = pd.read_csv(first_csv_file)
    column_headers = list(first_csv_data.columns)

    # Check if all CSV files have the same column headers
    for csv_file in csv_files[1:]:
        csv_file_path = os.path.join(filePathToLookForCSVs, csv_file)
        csv_data = pd.read_csv(csv_file_path)
        if list(csv_data.columns) != column_headers:
            # raise ValueError("All CSV files must have the same column headers.")
            print("Columns not the same, be careful!")

    # Merge the CSV files into a single DataFrame
    merged_data = pd.concat([pd.read_csv(os.path.join(filePathToLookForCSVs, csv_file)) for csv_file in csv_files])

    # Save the merged data to the output CSV file
    merged_data.to_csv(outputFilePathCSV, index=False)