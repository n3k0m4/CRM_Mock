## Matching

In the matching/ folder, you will find 2 datasets of companies and some of their attributes.
They represent the data available in the CRMs of 2 of our users.

### Mission

This algorithm  will use the data from the "companies" table and compute matches based on the company attributes

### Strategy 

0. Preliminary step:
   - Preparing the dataframes (appending a header to identify the columns)
   - Importing the csv files as pandas dfs
   - Transforming all data to string, making it lowercase and switching special chars to ease up the comparaison after.
   
1. Sanitization:
This step is just a way to sanitize the database from exact duplicates (all the columns are the same).

2. Simple matches:
At this level we have clean dataframes with no duplicates for same company. Now we start matching simple:
   - we merge tables and see if we get any perfect matches (same id&data or just data)
   
3. Complexe matching:
The matches till this point were simple and only look naive similarities. This part uses sequence matcher to get the best matche to a sequence from the data. To push the matching we use a couple from data with a threshold to get the results with a sequence matching score greater than our score.
   - First using (name, zipcode)
   - Then using (name, city)
   - Finally sequence matching with only the name
  
  
4. Filling the database.
   
   





