
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,  // Mức zoom ban đầu
        center: {lat: 0, lng: 0}  // Trung tâm bản đồ tại (0, 0)
    });

    // Dữ liệu bài báo và địa danh
    var articles = [
        {administrative_area: 'Hanoi', country: 'Vietnam', continent: 'Asia', lat: 21.0285, lon: 105.8542, links: ['https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html', 'https://e.vnexpress.net/news/world/world-warming-at-record-0-2c-per-decade-scientists-warn-4615206.html', 'https://e.vnexpress.net/news/news/vietnam-needs-35-bln-for-climate-change-adaptation-pm-4226847.html'], summaries: ['Severe flooding and emergencies due to Typhoon Yagi.', 'Capital of Vietnam, facing significant climate risks due to global warming.', 'Vietnam needs $35 billion for climate adaptation and faces significant climate challenges.'], sentiment: 'negative'},
        {administrative_area: 'Northern Vietnam', country: 'Vietnam', continent: 'Asia', lat: 21.2001, lon: 105.8512, links: ['https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html'], summaries: ['Directly affected by Typhoon Yagi and ongoing floods.'], sentiment: 'negative'},
        {administrative_area: 'Central Vietnam', country: 'Vietnam', continent: 'Asia', lat: 15.8801, lon: 108.337, links: ['https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html'], summaries: ['Forecasted to suffer from heavy rains and storms.'], sentiment: 'negative'},
        {administrative_area: 'North-Central Vietnam', country: 'Vietnam', continent: 'Asia', lat: 18.7008, lon: 105.878, links: ['https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html'], summaries: ['Heavily impacted by flooding and storms.'], sentiment: 'negative'},
        {administrative_area: 'South-Central Vietnam', country: 'Vietnam', continent: 'Asia', lat: 12.5663, lon: 109.219, links: ['https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html'], summaries: ['Potential storm impact indicated, but less severe.'], sentiment: 'neutral'},
        {administrative_area: 'Southern Vietnam', country: 'Vietnam', continent: 'Asia', lat: 10.8265, lon: 106.6297, links: ['https://e.vnexpress.net/news/news/environment/climate-change-intensifies-la-nina-leading-to-stronger-storms-experts-4791721.html'], summaries: ['Mentioned with potential storm impact, less severe effects.'], sentiment: 'neutral'},
        {administrative_area: 'Quang Ngai Province', country: 'Vietnam', continent: 'Asia', lat: 14.1, lon: 109.2, links: ['https://e.vnexpress.net/news/news/environment/asia-s-extreme-april-heat-worsened-by-climate-change-scientists-say-4746219.html'], summaries: ['Severe heat damage to crops and health; negatively affected by climate change.'], sentiment: 'negative'},
        {administrative_area: 'Kolkata', country: 'India', continent: 'Asia', lat: 22.5726, lon: 88.3639, links: ['https://e.vnexpress.net/news/news/environment/asia-s-extreme-april-heat-worsened-by-climate-change-scientists-say-4746219.html'], summaries: ['Extreme temperatures leading to health risks; negative impact from climate change.'], sentiment: 'negative'},
        {administrative_area: 'Manila', country: 'Philippines', continent: 'Asia', lat: 14.5995, lon: 120.9842, links: ['https://e.vnexpress.net/news/news/environment/asia-s-extreme-april-heat-worsened-by-climate-change-scientists-say-4746219.html'], summaries: ['Closures and heat risks reported; negatively affected by the ongoing heatwave.'], sentiment: 'negative'},
        {administrative_area: 'Kampot Province', country: 'Cambodia', continent: 'Asia', lat: 10.606, lon: 104.187, links: ['https://e.vnexpress.net/news/news/environment/asia-s-extreme-april-heat-worsened-by-climate-change-scientists-say-4746219.html'], summaries: ['Devastation of crops due to high heat; experiencing negative climate impacts.'], sentiment: 'negative'},
        {administrative_area: 'Tel Aviv', country: 'Israel', continent: 'Asia', lat: 32.0853, lon: 34.7818, links: ['https://e.vnexpress.net/news/news/environment/asia-s-extreme-april-heat-worsened-by-climate-change-scientists-say-4746219.html'], summaries: ['Record temperatures negatively affecting health; climate change concerns rise.'], sentiment: 'negative'},
        {administrative_area: 'Ho Chi Minh City (HCMC)', country: 'Vietnam', continent: 'Asia', lat: 10.7769, lon: 106.6959, links: ['https://e.vnexpress.net/news/world/world-warming-at-record-0-2c-per-decade-scientists-warn-4615206.html'], summaries: ['City experiencing extreme heat attributed to climate change impacts.'], sentiment: 'negative'},
        {administrative_area: 'Ben Tre Province', country: 'Vietnam', continent: 'Asia', lat: 10.2415, lon: 106.3782, links: ['https://e.vnexpress.net/news/news/vietnam-needs-35-bln-for-climate-change-adaptation-pm-4226847.html'], summaries: ['Ben Tre is experiencing drought with adverse effects on agriculture due to climate change.'], sentiment: 'negative'},
        {administrative_area: 'District 7', country: 'Vietnam', continent: 'Asia', lat: 10.7761, lon: 106.6953, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['Ho Chi Minh City is positively engaged in low-emission efforts.'], sentiment: 'positive'},
        {administrative_area: 'Vietnam', country: 'Vietnam', continent: 'Asia', lat: 14.0583, lon: 108.2772, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['Vietnam is on track to stay within emission limits with support.'], sentiment: 'positive'},
        {administrative_area: 'United States', country: 'United States', continent: 'North America', lat: 37.0902, lon: -95.712, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['US policies contribute to significant warming projections.'], sentiment: 'negative'},
        {administrative_area: 'Canada', country: 'Canada', continent: 'North America', lat: 56.1304, lon: -106.3468, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['Canada’s plans lead to high warming scenarios.'], sentiment: 'negative'},
        {administrative_area: 'Australia', country: 'Australia', continent: 'Oceania', lat: -25.2744, lon: 133.7751, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ["Australia's actions are insufficient for climate goals."], sentiment: 'negative'},
        {administrative_area: 'European Union', country: 'European Union', continent: 'Europe', lat: 50.8503, lon: 4.3517, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['EU efforts are lacking to limit warming effectively.'], sentiment: 'negative'},
        {administrative_area: 'China', country: 'China', continent: 'Asia', lat: 35.8617, lon: 104.1954, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['China’s projections suggest up to 5C warming.'], sentiment: 'negative'},
        {administrative_area: 'Russia', country: 'Russia', continent: 'Europe', lat: 61.524, lon: 105.3188, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ["Russia's policies lead to catastrophic warming risks."], sentiment: 'negative'},
        {administrative_area: 'Saudi Arabia', country: 'Saudi Arabia', continent: 'Asia', lat: 23.8859, lon: 45.0792, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['Saudi Arabia’s contributions are detrimental to climate goals.'], sentiment: 'negative'},
        {administrative_area: 'Turkey', country: 'Turkey', continent: 'Asia', lat: 38.9637, lon: 35.2433, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['Turkey’s policies indicate potential severe warming increases.'], sentiment: 'negative'},
        {administrative_area: 'Ghana', country: 'Ghana', continent: 'Africa', lat: 7.4383, lon: -0.1625, links: ['https://e.vnexpress.net/news/world/polluters-policies-would-see-warming-above-1-5c-limit-analysis-4544955.html'], summaries: ['Ghana needs support for maintaining low emissions.'], sentiment: 'positive'},
    
    ];

    var icons = {
        positive: {
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'  // Marker xanh lá cây cho tích cực
        },
        negative: {
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'  // Marker đỏ cho tiêu cực
        },
        neutral: {
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'  // Marker vàng cho trung lập
        }
    };

    // Thêm marker cho mỗi địa danh
    articles.forEach(function(article) {
        var marker = new google.maps.Marker({
        position: {lat: article.lat, lng: article.lon},
        map: map,
        icon: icons[article.sentiment].icon,  // Đặt màu marker theo trạng thái tin tức
        title: article.administrative_area + ', ' + article.country
        });

        // Nội dung hiển thị trong info window
        var contentString = `<b>${article.administrative_area}, ${article.country}</b><br>`;
        article.links.forEach(function(link, index) {
        var summary = article.summaries[index] || "No summary";  // Đảm bảo không lỗi nếu thiếu summary
        contentString += `<a href="${link}" target="_blank">${summary}</a><br>`;
        });

        var infoWindow = new google.maps.InfoWindow({
        content: contentString
        });

        // Khi click vào marker thì hiện info window
        marker.addListener('click', function() {
        infoWindow.open(map, marker);
        });
    });
    }

    // Gọi hàm initMap khi tải trang
    window.onload = initMap;

function sendMessage() {
    var input = document.getElementById('userInput');
    var chatBox = document.getElementById('chatBox');
    var userMessage = input.value.trim();

    if (userMessage) {
        // Tạo thẻ chứa tin nhắn của người dùng
        var userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('message', 'user');
        userMessageDiv.innerHTML = '<div class="content">' + userMessage + '</div>';
        chatBox.appendChild(userMessageDiv);

        // Cuộn xuống để xem tin nhắn mới
        chatBox.scrollTop = chatBox.scrollHeight;

        // Xóa nội dung đã nhập
        input.value = '';

        // Giả lập phản hồi từ hệ thống (Chatbot)
        setTimeout(function() {
            var botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('message', 'bot');
            var botResponse = `
                <b>Here are the key details regarding the current climate change situation as reported on VnExpress:</b><br>
                1. <b>Record April Heat Across Asia:</b> April 2024 saw extreme temperatures in Asia attributed to climate change, impacting regions including Vietnam, Myanmar, and Laos. The report indicated that these conditions led to school closures, crop damage, and hundreds of heat-related deaths.<br>
                2. <b>Typhoon Yagi:</b> This super typhoon, which struck in September 2024, was noted for its intensity and led to significant fatalities and destruction in northern Vietnam. Experts stated that climate change is responsible for the increased strength and frequency of such storms.<br>
                3. <b>La Niña Impact:</b> Climate change is intensifying the effects of La Niña, resulting in more severe storms, prolonged periods of extreme weather, and unusual climatic patterns. This phenomenon has been linked to the increased occurrence of intense storms and heavy rainfall, affecting multiple regions.<br>
                4. <b>Future Projections:</b> Meteorologists predict that the wet season will be characterized by higher-than-normal rainfall accompanied by more frequent storms, significantly impacting the northern and central regions of Vietnam.<br>
            `;
            botMessageDiv.innerHTML = '<div class="content">' + botResponse + '</div>';
            chatBox.appendChild(botMessageDiv);

            // Cuộn xuống để xem tin nhắn mới
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000); // Giả lập độ trễ 1 giây trước khi phản hồi
    }
}

document.getElementById('toggleChatList').addEventListener('click', function() {
    var chatList = document.getElementById('chatList');
    if (chatList.classList.contains('d-none')) {
        chatList.classList.remove('d-none');
    } else {
        chatList.classList.add('d-none');
    }
});

