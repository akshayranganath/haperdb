# Video Analytics with HarperDB

This is a sample application to showcase the ease of using Cloudinary video player analytics and the ability of HarperDB to consume the analytics and create a dashboard.

![video feeding data into a database](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto,w_650/blog/illustration-video-database)

# Background
[Cloudinary's video player](https://cloudinary.com/documentation/cloudinary_video_player#banner) has the ability to capture various events while loading and playing the video. Specifically, it can capture the following events:

```
loadstart, suspend, abort, error, emptied, stalled, loadedmetadata, loadeddata, canplay, canplaythrough, playing, waiting, seeking, seeked, ended, durationchange, timeupdate, progress, play, pause, ratechange, volumechange, fullscreenchange, posterchange
```
[Source](https://cloudinary.com/documentation/video_player_api_reference#events)

These events can be captured and reported on Analytics platforms like Google Analytics. In this example, I wanted to show the ability to capture these events and analyze the events.

# Architecture

In this demo, I am doing the following:
* Cloudinary player feeds analytics events to a local server.
* Server is running an [ExpressJS](https://expressjs.com/) application. This consumes the POST requests and writes the event details to a database.
* I am using [HarperDB](https://www.harpersystems.dev/) as my database. It is a simple-to-use and production-grade database. It is also very developer friendly and hassle-free to setup.

For analyzing the data, I am doing the following:
* I have a [Streamlit](https://streamlit.io/) front-end to show various options.
* I extract data using SQL and then convert to a `pandas` dataframe.
* Using `plotly.express`, I create graphs to show the analysis.

Here is a high level architecture.
![Architecture diagram](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/workflow.drawio.png)

# Sample charts

![video player events](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/analytics-events.png)

![video playback measure](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/analytics-percentage-completed.png)

