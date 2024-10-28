from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Define the origins that are allowed to access the API
origins = [
    "http://localhost:4000",  # Replace with your frontend URL
    "http://localhost:8000",  # You can add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins or use ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class Location(BaseModel):
    administrative_area: str
    country: str
    continent: str
    lat: float
    lon: float
    links: List[str]
    summaries: List[str]
    sentiment: str

# Initialize a list of locations
locations = [
    {"administrative_area": "Hanoi", "country": "Vietnam", "continent": "Asia", "lat": 21.0285, "lon": 105.8542, "links": ["https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html", "https://e.vnexpress.net/news/world/world-warming-at-record-0-2c-per-decade-scientists-warn-4615206.html", "https://e.vnexpress.net/news/news/vietnam-needs-35-bln-for-climate-change-adaptation-pm-4226847.html"], "summaries": ["Severe flooding and emergencies due to Typhoon Yagi.", "Capital of Vietnam, facing significant climate risks due to global warming.", "Vietnam needs $35 billion for climate adaptation and faces significant climate challenges."], "sentiment": "negative"},
    {"administrative_area": "Northern Vietnam", "country": "Vietnam", "continent": "Asia", "lat": 21.2001, "lon": 105.8512, "links": ["https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html"], "summaries": ["Directly affected by Typhoon Yagi and ongoing floods."], "sentiment": "negative"},
    {"administrative_area": "Central Vietnam", "country": "Vietnam", "continent": "Asia", "lat": 15.8801, "lon": 108.337, "links": ["https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html"], "summaries": ["Forecasted to suffer from heavy rains and storms."], "sentiment": "negative"},
    {"administrative_area": "North-Central Vietnam", "country": "Vietnam", "continent": "Asia", "lat": 18.7008, "lon": 105.878, "links": ["https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html"], "summaries": ["Heavily impacted by flooding and storms."], "sentiment": "negative"},
    # Add more locations as necessary
]

@app.post("/locations", response_model=List[Location])
def get_locations(links: List[str]):
    return locations

class InputModel(BaseModel):
    text: str
    is_crawl: bool

class ResponseModel(BaseModel):
    text: str
    links: List[str]
    status: str

@app.post("/getResponse", response_model=ResponseModel)
async def get_response(input_data: InputModel):
    text = input_data.text
    is_crawl = input_data.is_crawl
    
    # Logic xử lý
    links = []  # Có thể thêm logic để lấy các liên kết nếu cần
    status = "success"  # Hoặc "error" tùy theo kết quả xử lý

    # Tạo phản hồi dựa trên nội dung
    bot_response = (
        "<b>Here are the key details regarding the current climate change situation as reported on VnExpress:</b><br>"
        "1. <b>Record April Heat Across Asia:</b> April 2024 saw extreme temperatures in Asia attributed to climate change, impacting regions including Vietnam, Myanmar, and Laos. The report indicated that these conditions led to school closures, crop damage, and hundreds of heat-related deaths.<br>"
        "2. <b>Typhoon Yagi:</b> This super typhoon, which struck in September 2024, was noted for its intensity and led to significant fatalities and destruction in northern Vietnam. Experts stated that climate change is responsible for the increased strength and frequency of such storms.<br>"
        "3. <b>La Niña Impact:</b> Climate change is intensifying the effects of La Niña, resulting in more severe storms, prolonged periods of extreme weather, and unusual climatic patterns. This phenomenon has been linked to the increased occurrence of intense storms and heavy rainfall, affecting multiple regions.<br>"
        "4. <b>Future Projections:</b> Meteorologists predict that the wet season will be characterized by higher-than-normal rainfall accompanied by more frequent storms, significantly impacting the northern and central regions of Vietnam.<br>"
    )

    return ResponseModel(text=bot_response, links=links, status=status)