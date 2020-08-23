# -*- coding: utf-8 -*-

import pandas as pd
import time
from difflib import SequenceMatcher
import sqlite3

# STEP 0:
'''
Prep-ing the data!
'''
# Adding a header name to the file (because it's missing)
colnames = ['id', 'name', 'website', 'unknown',
            'phone number', 'address', 'postcode', 'city', 'country']


'''
- Importing the data from the csv files and making all the data as strings and lower case (easier to manipulate after) and '-' with ' '
- Removing all the special chars (é,à,è..)
- Fixing all the post codes (some of them were given as float)
'''


def prepare_df(dataset_file):
    final_dataset = pd.read_csv(dataset_file, names=colnames)
    final_dataset = final_dataset.replace('-', ' ', regex=True)
    final_dataset = final_dataset.astype(str).apply(lambda x: x.str.lower())
    final_dataset = final_dataset.apply(lambda x: x.str.normalize(
        'NFKD').str.encode('ascii', errors='ignore').str.decode('utf-8'))
    for i, row in enumerate(final_dataset["postcode"]):
        if row[-2:] == ".0":
            final_dataset["postcode"][i] = row[:-2]
    return final_dataset


dataset_A = prepare_df('dataset_A.csv')
dataset_B = prepare_df('dataset_B.csv')
# STEP 1:
'''
 Looking at the files given we could notice that we have perfect matches (all fields are the same except id) in the same csv
 This will create us a problem in the matching phase so we decide to keep only the first occurence of the companies
'''
# deleting duplicates within each dataset
dataset_A = dataset_A.drop_duplicates(
    subset=['name', 'website', 'phone number', 'unknown', 'address', 'postcode', 'city', 'country'], keep='first')
dataset_B = dataset_B.drop_duplicates(
    subset=['name', 'website', 'phone number', 'unknown', 'address', 'postcode', 'city', 'country'], keep='first')


# STEP 2:
'''
There are cases where multiple to all fields are identical in both datasets, 
we therefore merge both datasets, and check for duplicates based on a number of column values 
(first all columns, then all except id, removing less significant columns until the remaining are all equally significant)
We then extract them into a map (dict) and save them then drop them from the dataframes.
Results : 1258 elements are already mapped (with a perfect match including id)
'''
# adding source column before merging dfs
dataset_A['source'] = ['a']*dataset_A.shape[0]
dataset_B['source'] = ['b']*dataset_B.shape[0]

# merging dfs
data = pd.concat([dataset_A, dataset_B])

# list of column names ordered based on the most significant information
ordered_colnames = ['id', 'phone number', 'address',
                    'website', 'city', 'postcode', 'country', 'unknown', 'name']
# n is number of columns to always keep (name,unknown)
# name is the most important information and unknown column does not add or remove information
# later if more than one match is found it is not taken into account
n = 2


def compute_duplicate_matches(df, colnames):
    '''Given a df and a column name list, returns list of id tuples containing 
    duplicates based on a full match of values ranging from all columns to the remaining two 
    and drops them from df
    '''
    match_list = []
    for i in range(len(colnames)-n):
        # In each iteration, the least significant column is removed to look for new matches
        subset = colnames[i:]
        duplicates = df[df.duplicated(subset=subset, keep=False)]
        matches = duplicates.groupby(subset).apply(
            lambda x: tuple(x.id+x.source)).tolist()
        match_list += matches
        df = df.drop_duplicates(subset=subset, keep=False)
        '''In some cases, matching rows are either from the same df or are superior to 2
        in those cases, matches are not saved'''
        def_matches = []
        for match in match_list:
            if len(match) == 2:
                if match[0][-1] == 'a' and match[1][-1] == 'b':
                    match_no_source = (match[0][:-1], match[1][:-1])
                    def_matches.append(match_no_source)

    return def_matches


def_matches = compute_duplicate_matches(data, ordered_colnames)
# storing match ids from each dataset in respective lists
saved_matches_A = [def_matches[i][0] for i in range(len(def_matches))]
saved_matches_B = [def_matches[i][1] for i in range(len(def_matches))]
# removing resulting matches from initial dfs
dataset_A = dataset_A[~(dataset_A.id.isin(saved_matches_A))]
dataset_B = dataset_B[~(dataset_B.id.isin(saved_matches_B))]

# STEP 3:
'''
To find remaining matches, we compute name similarity for rows with equal values on specific columns
First, name similarity along with zipcode equality
Then, name similarity along with city equality
Finally, just name similarity (aka unknown column equality because only contains nan values)
'''
# print(len(def_matches))


def similar(a, b):
    '''Given two strings, computes similarity score
    '''
    return SequenceMatcher(lambda x: x in '(parent)', a, b,).ratio()


def matcher(dataset_A, dataset_B, columnname, threshold=0):
    '''Given two datasets, a common column name, and a score threshold,
    returns dictionary matching ids based on name similarity (superior to threshold) and on column name value equality
    '''
    dico = dict()
    # values set contains all unique column values for chosen columnname
    values = set(dataset_A[columnname].unique())
    values_B = set(dataset_B[columnname].unique())
    values.update(values_B)
    for value in values:
        # in each iteration, smaller dfs are created containing specific value of columnname
        # remove nan for faster less accurate results
        new_dataset_A = dataset_A[dataset_A[columnname].isin([value, 'nan'])]
        new_dataset_B = dataset_B[dataset_B[columnname] == value]
        # following loop iterates over both dfs finding highest name similarity score
        for indexA, rowA in new_dataset_A.iterrows():
            score = 0
            id = 'nan'
            for indexB, rowB in new_dataset_B.iterrows():
                if (similar(new_dataset_A['name'][indexA], new_dataset_B['name'][indexB]) > score):
                    score = similar(
                        new_dataset_A['name'][indexA], new_dataset_B['name'][indexB])
                    id = new_dataset_B['id'][indexB]
            if score >= threshold and id != 'nan':
                # adding match to dict
                dico.update({new_dataset_A['id'][indexA]: id})
                # removing found match from next search
                new_dataset_B = new_dataset_B.drop(
                    new_dataset_B[new_dataset_B['id'] == id].index)
        print(list(dico.keys())[-1], list(dico.values())[-1])
    return dico

# MAKING IT WORK !


start = time.time()
# applying function to name + zipcode 0.6 threshold
match_dict = matcher(dataset_A, dataset_B, 'postcode', 0.6)
match_A = list(match_dict.keys())
match_B = list(match_dict.values())
dataset_A = dataset_A[~(dataset_A.id.isin(match_A))]
dataset_B = dataset_B[~(dataset_B.id.isin(match_B))]
# applying function to name + city
match_2_dict = matcher(dataset_A, dataset_B, 'city')
match_2_A = list(match_2_dict.keys())
match_2_B = list(match_2_dict.values())
last_left_A = dataset_A[~(dataset_A.id.isin(match_2_A))]
last_left_B = dataset_B[~(dataset_B.id.isin(match_2_B))]
# applying function to only name
last_match = matcher(last_left_A, last_left_B, 'unknown')
last_match_A = list(last_match.keys())
last_match_B = list(last_match.values())
match_df = pd.DataFrame(data={'dataset_A': saved_matches_A+match_A+match_2_A +
                              last_match_A, 'dataset_B': saved_matches_B+match_B+match_2_B+last_match_B})
end = time.time()
print('Took', end-start, 'seconds')
match_df = match_df.astype(int)
match_df.to_csv('match_table.csv')


# This function takes the databse file and the final csv and then fill the data inside.

def fill_db(db, final_df):
    try:
        conn = sqlite3.connect(db)
        cursor = conn.cursor()
        cursor.execute("DROP TABLE matches;")
        conn.commit()
        script = '''
        CREATE TABLE IF NOT EXISTS matches (
	        id INTEGER PRIMARY KEY AUTOINCREMENT,
	        source_name TEXT NOT NULL,
	        left_company_id INTEGER NOT NULL UNIQUE,
	        right_company_id INTEGER NOT NULL UNIQUE
        );
        '''
        cursor.executescript(script)
        data = pd.read_csv(final_df)
        for index, row in data.iterrows():
            cursor.execute("INSERT INTO matches(source_name,left_company_id,right_company_id) VALUES ('dataset_A.csv',(?),(?))",
                           (int(row['dataset_A']), int(row['dataset_B'])))
            conn.commit()
        conn.close()
    except ConnectionError as e:
        print(e)


fill_db("junk_database.sqlite3", "match_table.csv")
