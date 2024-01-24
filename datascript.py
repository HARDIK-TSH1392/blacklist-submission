import csv
import random
from datetime import datetime, timedelta

# Function to generate random country codes
def generate_country_code():
    countries = ['US', 'CA', 'GB', 'FR', 'DE', 'JP', 'AU']
    return random.choice(countries)

# Function to generate CSV data
def generate_csv_data(rows=10000):
    header = ['ID', 'UID', 'Name', 'Score', 'Country', 'TimeStamp']

    with open('sample_data.csv', 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(header)

        for i in range(1, rows + 1):
            row = [
                i,
                f'user{i:04d}',
                f'Name{i:03d}',
                random.randint(1, 1000),
                generate_country_code(),
                (datetime.now() - timedelta(days=random.randint(1, 365))).strftime('%Y-%m-%d %H:%M:%S')
            ]
            csv_writer.writerow(row)

# Generate 10,000 rows of CSV data
generate_csv_data(10000)
