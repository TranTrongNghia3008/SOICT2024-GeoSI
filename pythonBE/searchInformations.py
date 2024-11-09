from pythonBE.config import *

def analyze_prompt(text: str):
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Extract the information. If site exists, return the domain name of the site. Otherwise return empty."},
            {"role": "user", "content": text},
        ],
        response_format=SearchQuery,
    )

    query = completion.choices[0].message.parsed

    return query

def search_relevant_links(query: SearchQuery, topK: int, conversationsessionsID: str):
    driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
    
    search_url = f'https://www.google.com/search?q=site:{query.site} {query.query}'
    print(search_url)
    driver.get(search_url)

    articles = driver.find_elements(By.CLASS_NAME, 'N54PNb')
    links = []

    existing_links = set()
    existing_documents = db.articlefiles.find({"SessionID": conversationsessionsID})
    for doc in existing_documents:
        existing_links.add(doc["Link"])

    for article in articles[:min(topK, len(articles))]:
        title = article.find_element(By.CLASS_NAME, 'LC20lb').text
        link = article.find_element(By.TAG_NAME, 'a').get_attribute('href')

        if link not in existing_links:
            # links.append({"title": title, "link": link})
            link_article = LinkArticle(
                title=title,
                link=link,
            )
            links.append(link_article)
    print(links)

    driver.quit()

    return links

def convert_to_pdf(link_articles: List[LinkArticle], conversationsessionsID: str):
    file_paths = []
    links = []

    session_storage_path = f"{STORAGE_PATH}/{conversationsessionsID}"
    os.makedirs(session_storage_path, exist_ok=True)

    for article in link_articles:
        title = re.sub(r'[^a-zA-Z\s]', '', article.title)
        title = title.replace(" ", "_")
        pdf_path = f"{session_storage_path}/{title}.pdf"
        url = article.link

        existing_article = db.articlefiles.find_one({
            "Link": article.link
        })
        
        if existing_article:
            file_id = existing_article["FileId"]

            if not db.articlefiles.find_one({"SessionID": conversationsessionsID, "Link": article.link}):
                db.articlefiles.insert_one({
                    "SessionID": conversationsessionsID,
                    "Title": article.title,
                    "Link": article.link,
                    "FileId": file_id,
                    "createdAt": datetime.utcnow(),
                    "updatedAt": datetime.utcnow(),
                })

            with open(pdf_path, 'wb') as f:
                f.write(fs.get(file_id).read())
            
            print(f"Tải file PDF từ MongoDB: {pdf_path}")
            file_paths.append(pdf_path)
            links.append(article)
            
            continue

    
        try: 
            driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
            # Access the webpage and create PDF
            driver.get(url)
            
            print_options = {'path': pdf_path, 'printBackground': True}
            pdf = driver.execute_cdp_cmd("Page.printToPDF", print_options)
            
            # Decode and save the PDF file
            pdf_data = base64.b64decode(pdf['data'])

            with open(pdf_path, 'wb') as f:
                f.write(pdf_data)
            driver.quit()

            file_id = fs.put(pdf_data, filename=pdf_path)

            db.articlefiles.insert_one({
                "SessionID": conversationsessionsID,
                "Title": article.title,
                "Link": article.link,
                "FileId": file_id, 
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow(),
            })

            file_paths.append(pdf_path)
            links.append(article) 
        except:
            print(f"Unable to crawl website: {url}")

    print(f"PDF files saved to: {file_paths}")

    return file_paths, links