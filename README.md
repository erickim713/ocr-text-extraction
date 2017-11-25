# League Win Rate

Blue and Purple side in league of legends are both equal. However, the orientation in which the user plays in is told to have some effect on the result of the game. So I tried gathering the win rates via online. The only source that I found was [LeagueofGraphs](https://www.leagueofgraphs.com/infographics)

Since the win rates are in the images provided by the League of Graphs. I had to scrape the images in scraper.js and put them through the Google's google vision API. Via text extraction API, I was able to extract the text and get the win rates. Even though I thought the format of the scraped image was pretty similar for the text extract to be resulting in identical format, the result came out to have couple errors. _(Probably due to resolution?)_

