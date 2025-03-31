import streamlit as st
import plotly.express as px
import pandas as pd
import os
import requests

# display a pie chart of events
def make_post_request(payload:dict):
    resp = requests.post(
        os.getenv('HARPERDB_URL'),
        json=payload,
        auth=(os.getenv('HARPERDB_USERNAME'), os.getenv('HARPERDB_PASSWORD'))
    )

    resp.raise_for_status()
    return resp.json()

st.title("Distribution of Events")
def get_records(sql_query:str):
    # HarperDB's REST API expects a JSON payload with the operation type and query
    payload = {
        "operation": "sql",
        "sql": sql_query
    }    
    return make_post_request(payload)

query = f'select * from {os.getenv("HARPERDB_SCHEMA")}.{os.getenv("HARPERDB_TABLE")};'
data = get_records(query)
df = pd.DataFrame(data)
#st.write(df['event'].value_counts())
fig = px.pie(df, names='event', title='Distribution of Events')
st.plotly_chart(fig)