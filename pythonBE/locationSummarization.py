from pythonBE.chatbot import *
from pythonBE.config import *

def flow_extract_location(assistant_id):
    prompt = """
        Please read and analyze the article in the provided PDF file. Your task is:
          1. Please tell me the names of the administrative units below the main country (State, Province, District, Region, Territory, City, Area) where the event occurs or is mentioned, defaulting to the capital of that country (Borders Associated Listing Not Required). Return a list.
          2. Summary of the main content of the news is in the PDF file.
          3. Based on the main topic and content, determine the general sentiment of each of the above locations and classify them into one of the following categories: 'positive', 'negative' or 'neutral'.
    """

    result = flow_qa(prompt, assistant_id)

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Extract the information. 'summary' has a 100 character limit. 'sentiment' is one of three words: 'positive', 'negative' or 'neutral'"},
            {"role": "user", "content": result},
        ],
        response_format=ListLocation,
    )

    return completion.choices[0].message.parsed

def merge_locations(link_articles):
    merged_locations = {}

    for article in link_articles:
        link = article['link']
        for loc in article['local'].listLocation:
            key = (loc.administrative_area, loc.country, loc.continent, loc.lat, loc.lon)

            if key not in merged_locations:
                merged_locations[key] = {
                    'administrative_area': loc.administrative_area,
                    'country': loc.country,
                    'continent': loc.continent,
                    'lat': loc.lat,
                    'lon': loc.lon,
                    'links': [link],
                    'summaries': [loc.summary],
                    'sentiment': defaultdict(int)
                }
            else:
                merged_locations[key]['links'].append(link)
                merged_locations[key]['summaries'].append(loc.summary)

            merged_locations[key]['sentiment'][loc.sentiment] += 1

    result = []
    for loc_data in merged_locations.values():
        dominant_sentiment = max(loc_data['sentiment'], key=loc_data['sentiment'].get)
        loc_data['sentiment'] = dominant_sentiment
        result.append(loc_data)

    return result