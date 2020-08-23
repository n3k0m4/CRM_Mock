#!/usr/bin/env/python3
import requests
import random

s = requests.session()
companies_url = "http://localhost:3000/companies"
company_url = "http://localhost:3000/companies" + str(random.randint(0, 5000))
matches_url = "http://localhost:3000/matches"

print('''# Trying the get companies''')
r = s.get()
print(r.text)

print('''# Trying the get on a company''')
r = s.get(companies_url)
print(r.text)

print('''# Trying the get on a match for company 3880 (it should be 16833) ''')
r = s.get(matches_url+"3880")
print(r.text)
