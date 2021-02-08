## Backend Web

The app backend is based on the principals of RESTful APIs that will make exposing data to the frontend easier.

We prepared data that corresponds to the output of the "Matching" section, in the form of a file named backend_base.sqlite3.
It contains:

- a "companies" table, containing many records of company and their attributes
- a "matches" table, containing a sample of matches computed by Sharework

### Mission

The API on top of this database allows the following operations:

- list companies
- access a single company
- list matching companies for a given company



