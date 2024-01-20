from my_project.api import call_api
from my_project.data import save_data, check_data

def main():
    # Call the API and get the data
    data = call_api()

    # Save the data
    save_data(data)

    # Check the data
    check_data()

if __name__ == "__main__":
    main()