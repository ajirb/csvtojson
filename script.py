import pandas as pd
import os

base = os.getcwd()+'/uploads/'
df = pd.read_csv(base+'temp.csv')
df.to_json(base+'/temp.json', orient='records')