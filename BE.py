from pythonBE.locationSummarization import *
from pythonBE.searchInformations import *
from pythonBE.chatbot import *
from pythonBE.config import *

# pip install fastapi uvicorn pydantic openai selenium webdriver-manager pymongo
# python -m uvicorn BE:app --reload

# Initialize the FastAPI app
app = FastAPI()

@app.get("/start_session")
async def start_session(user_id: str):
    session_data = {
        "UserID": user_id,
        "History": [],
        "VectorStoreID": None,
        "AssistantID": None,
        "Title": "New Chat",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }
    session = db.conversationsessions.insert_one(session_data)
    return {"session_id": str(session.inserted_id)}

@app.get("/getLocationInformations")
async def get_location_informations(link_articles: list, files_path: list, conversationsessionsID: str):
    for i in range(len(link_articles)):
        news = link_articles[i]
        file_path = files_path[i]

        title = re.sub(r'[^a-zA-Z\s]', '', news['title'])
        title = title.replace(" ", "_")

        vector_store_1 = create_vector_store(f"{conversationsessionsID}-{title}")
        update_vector_store(vector_store_1.id, [file_path])

        assistant_1 = create_assistant(vector_store_1.id)

        list_location = flow_extract_location(assistant_1.id)
        news['local'] = list_location

    merged_locations = merge_locations(link_articles)

    for loc in merged_locations:
        loc_data = {
            "SessionID": ObjectId(conversationsessionsID),
            "administrative_area": loc.get("administrative_area", ""),
            "country": loc.get("country", ""),
            "continent": loc.get("continent", ""),
            "lat": loc.get("lat"),
            "lon": loc.get("lon"),
            "links": loc.get("links", []),
            "summaries": loc.get("summaries", []),
            "sentiment": loc.get("sentiment", ""),
            "__v": 0,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
        }

        db.locations.insert_one(loc_data)
    
    return merged_locations

@app.get("/getRelevantLinks")
async def get_relevant_links(text: str, topK: int, conversationsessionsID: str):
    query = analyze_prompt(text)
    print(query)
    
    if not query.site:
        return JSONResponse(content={"message": "No site found in the text"}, status_code=400)
    
    links = search_relevant_links(query, topK, conversationsessionsID)
    file_paths = convert_to_pdf(links, conversationsessionsID)
    locations = await get_location_informations(links, file_paths, conversationsessionsID)
    
    return {"query": query, "links": links, "file paths": file_paths, "locations": locations}

@app.get("/getResponse")
async def get_response(text: str, isCrawl: bool, linkSpecific: str, topK: int, conversationsessionsID: str):
    session = db.conversationsessions.find_one({"_id": ObjectId(conversationsessionsID)})
    vector_store_id = session.get("VectorStoreID")
    assistant_id = session.get("AssistantID")
    history = session.get("History")

    if not history:
        isCrawl = True

    if linkSpecific.startswith("http://") or linkSpecific.startswith("https://"):
        relevant_files = convert_to_pdf([{"title": "Custom Article", "link": linkSpecific}], conversationsessionsID)
    elif isCrawl:
        relevant_files = await get_relevant_links(text=text, topK=topK, conversationsessionsID=conversationsessionsID)
    
    if relevant_files:
        if not vector_store_id:
            vector_store = create_vector_store(conversationsessionsID)
            vector_store_id = vector_store.id

        update_vector_store(vector_store_id, relevant_files["file paths"])
        assistant = create_assistant(vector_store_id)
        assistant_id = assistant.id
        
        db.conversationsessions.update_one(
            {"_id": ObjectId(conversationsessionsID)},
            {"$set": {"VectorStoreID": vector_store_id, "AssistantID": assistant_id}}
        )

    qa_history = None if not session.get("History") else "\n".join(session.get("History"))
    prompt = (
        f"The uploaded files are articles that were searched with the keyword '{text}'.\n"
        f"Pay attention to previous Q&A history (if any): \n{qa_history}\n"
        f"Given the query below, identify and return the key details explicitly mentioned that are necessary for information retrieval.\n\n"
        f"QUERY: '{text}'"
    )
    
    response = flow_qa(prompt, assistant_id)
    db.conversationsessions.update_one(
        {"_id": ObjectId(conversationsessionsID)},
        {"$push": {"History": f"User: {text}"}}
    )
    db.conversationsessions.update_one(
        {"_id": ObjectId(conversationsessionsID)},
        {"$push": {"History": f"System: {response}"}}
    )

    return {
        "textAnswer": response,
        "links": relevant_files["links"],
        "status": "success"
    }