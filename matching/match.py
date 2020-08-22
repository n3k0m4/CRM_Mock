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

# Importing the data from the csv files and making all the data as strings and lower case (easier to manipulate after)
dataset_A = pd.read_csv("dataset_A.csv", names=colnames)
dataset_B = pd.read_csv("dataset_B.csv", names=colnames)
dataset_A = dataset_A.astype(str).apply(lambda x: x.str.lower())
dataset_B = dataset_B.astype(str).apply(lambda x: x.str.lower())

# Removing all the special chars (é,à,è..)
dataset_A = dataset_A.apply(lambda x: x.str.normalize(
    'NFKD').str.encode('ascii', errors='ignore').str.decode('utf-8'))
dataset_B = dataset_B.apply(lambda x: x.str.normalize(
    'NFKD').str.encode('ascii', errors='ignore').str.decode('utf-8'))

# Fixing all the post codes (some of them were gives as float)


def fix_post_code(dataset):
    for i, row in enumerate(dataset["postcode"]):
        if row[-2:] == ".0":
            dataset["postcode"][i] = row[:-2]
    return dataset


dataset_A = fix_post_code(dataset_A)
dataset_B = fix_post_code(dataset_B)
# STEP 1:
'''
 Looking at the files given we could notice that we have perfect matches (all fields are the same) in the same csv
 This will create us a problem in the matching phase so we decide to keep only the first occurence of the companies
'''
# Deleting duplicates within each dataset
dataset_A = dataset_A.drop_duplicates(
    subset=['name', 'website', 'phone number', 'unknown', 'address', 'postcode', 'city', 'country'], keep='first')
dataset_B = dataset_B.drop_duplicates(
    subset=['name', 'website', 'phone number', 'unknown', 'address', 'postcode', 'city', 'country'], keep='first')

# STEP 2:
'''
Best case scenario 1. Our two files contain duplicates, where a company is identically matched in the other file (even the id ^^')
We then extract them into a map (dict) and save them then drop them from the dataframes.
Results : 1258 elements are already mapped (with a perfect match)
'''
# Merge dataframes
data = pd.concat([dataset_A, dataset_B])
# Check for full duplicates between dfs
duplicateDFRow = data[data.duplicated(keep='first')]
complete_matches = list(duplicateDFRow['id'])
# Remove complete matches from each dataset
dataset_A = dataset_A.drop(
    dataset_A[dataset_A['id'].isin(complete_matches)].index)
dataset_B = dataset_B.drop(
    dataset_B[dataset_B['id'].isin(complete_matches)].index)
# Drop full duplicates from data
data = data.drop_duplicates(keep=False)

# STEP 3:
'''
Best case scenario 2. Our two files contain duplicates, where a company has identical data in both files (except the id ^^')
We then extract them into a map (dict) and save them then drop them from the dataframes.
Results : 1120 elements are mapped in this step
'''
# Check for duplicates except id column
df = data[data.duplicated(subset=list(data)[1:], keep=False)]

# Compute list of tuples representing id matches
matches_exceptid = df.groupby(['name', 'phone number', 'website', 'address',
                               'postcode', 'city', 'country']).apply(lambda x: tuple(x.id)).tolist()
ind_A = [matches_exceptid[i][0] for i in range(len(matches_exceptid))]
ind_B = [matches_exceptid[i][1] for i in range(len(matches_exceptid))]

# Removing matches except id from both datasets
dataset_A = dataset_A.drop(dataset_A[dataset_A['id'].isin(ind_A)].index)
dataset_B = dataset_B.drop(dataset_B[dataset_B['id'].isin(ind_B)].index)

# STEP 4:
'''
In this step we don't have an easy/sure way of mapping the companies but we still can get closer.

'''


# The base of matcher similar calls SequenceMatcher
def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()


def matcher(dataset_A, dataset_B):

    index = []
    dico = dict()
    for indexA, rowA in dataset_A.iterrows():
        score = 0
        start = time.time()
        filter = ((dataset_B['postcode'] == dataset_A['postcode'][indexA]) | (
            dataset_B['postcode'] == 'nan'))
        new_dataset_B = dataset_B.where(filter)
        new_dataset_B = new_dataset_B.dropna()
        for indexB, rowB in new_dataset_B.iterrows():
            '''condition_1 = (dataset_A['postcode'][indexA] ==
                          'nan' or dataset_B['postcode'][indexB] == 'nan')
            condition_2 = (dataset_A['postcode'][indexA] ==
                          dataset_B['postcode'][indexB])
            if(condition_1 or condition_2):'''
            if (similar(dataset_A['name'][indexA], new_dataset_B['name'][indexB]) >= score):
                score = similar(dataset_A['name'][indexA],
                                new_dataset_B['name'][indexB])
                id = new_dataset_B['id'][indexB]
        dico.update({dataset_A['id'][indexA]: id})
        print(time.time() - start, 'seconds')
        print(dico)
        dataset_B = dataset_B.drop(dataset_B[dataset_B['id'] == id].index)


# print(complete_matches)
#matcher(dataset_A, dataset_B)
