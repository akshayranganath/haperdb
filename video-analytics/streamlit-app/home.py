import streamlit as st

# create a home page with the options for looking 3 things:
# 1. Distribution of events
# 2. Distribution of events by type
# 3. Histogram of percentage completed

st.title("Home")
st.write(
    """
    This is a simple Streamlit application that allows you to visualize the distribution of events, 
    the distribution of events by type, and the histogram of percentage completed.
    """
)

st.write("## Options")
st.write("1. Distribution of events")
st.write("2. Distribution of events by type")
st.write("3. Histogram of percentage completed")

from dotenv import load_dotenv 
load_dotenv()