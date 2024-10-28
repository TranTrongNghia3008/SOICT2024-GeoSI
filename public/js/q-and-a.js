const links = [
    "https://example.com/new-climate-article-1",
    "https://example.com/new-climate-article-2"
];

async function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,  // Mức thu phóng ban đầu
        center: { lat: 0, lng: 0 }  // Trung tâm bản đồ tại (0, 0)
    });

    try {
        // Gửi yêu cầu POST đến API để lấy dữ liệu địa điểm
        const response = await fetch('http://localhost:8000/locations/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(links)  // Gửi mảng links
        });

        // Kiểm tra phản hồi từ API
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // Chờ và lấy dữ liệu JSON
        const locations = await response.json();

        const icons = {
            positive: {
                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'  // Đánh dấu màu xanh cho cảm xúc tích cực
            },
            negative: {
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'  // Đánh dấu màu đỏ cho cảm xúc tiêu cực
            },
            neutral: {
                icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'  // Đánh dấu màu vàng cho cảm xúc trung tính
            }
        };

        // Thêm các marker cho mỗi địa điểm
        locations.forEach(article => {
            const marker = new google.maps.Marker({
                position: { lat: article.lat, lng: article.lon },
                map: map,
                icon: icons[article.sentiment].icon,  // Đặt màu marker dựa trên cảm xúc
                title: `${article.administrative_area}, ${article.country}`
            });

            // Tạo nội dung cho cửa sổ thông tin
            let contentString = `<b>${article.administrative_area}, ${article.country}</b><br>`;
            article.links.forEach((link, index) => {
                const summary = article.summaries[index] || "No summary";  // Đảm bảo không có lỗi nếu không có tóm tắt
                contentString += `<a href="${link}" target="_blank">${summary}</a><a href="#" data-bs-toggle="tooltip" title="Q & A" onclick="sendMessageFromLocation('${summary}')"><i class="bi bi-question-circle"></i></a><br>`;
            });

            const infoWindow = new google.maps.InfoWindow({
                content: contentString
            });

            // Hiển thị cửa sổ thông tin khi nhấp vào marker
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
        });
    } catch (error) {
        console.error('Error fetching location data:', error);
    }
}

// Gọi hàm initMap khi trang được tải
window.onload = initMap;

async function sendMessage() {
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

        try {
            // Gọi API getResponse
            const response = await fetch('http://localhost:8000/getResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: userMessage, is_crawl: false })  // Gửi tin nhắn và trạng thái isCrawl
            });

            // Kiểm tra phản hồi từ API
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            // Chờ và lấy dữ liệu JSON
            const data = await response.json();
            var botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('message', 'bot');
            botMessageDiv.innerHTML = '<div class="content">' + data.text + '</div>'; // Sử dụng text từ phản hồi
            chatBox.appendChild(botMessageDiv);

            // Cuộn xuống để xem tin nhắn mới
            chatBox.scrollTop = chatBox.scrollHeight;

            await updateHistory(userMessage, data.text);

        } catch (error) {
            console.error('Error fetching response:', error);
        }
    }
}

async function updateHistory(userMessage, botMessage) {
    try {
        // Giả sử bạn đã lưu conversationId khi chọn cuộc trò chuyện
        const conversationId = localStorage.getItem('conversationId');

        // Gọi API cập nhật History
        const response = await fetch(`q-and-a/conversations/${conversationId}/updateHistory`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                history: [`User: ${userMessage}`, `System: ${botMessage}`] // Gửi lịch sử cập nhật
            })
        });

        // Kiểm tra phản hồi từ API cập nhật History
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        console.log('History updated successfully');
    } catch (error) {
        console.error('Error updating history:', error);
    }
}

async function sendMessageFromLocation(query) {
    console.log(query)
    var input = document.getElementById('userInput');
    input.innerText = query;
    var sendMessageBtn = document.getElementById('sendMessage');
    sendMessageBtn.click();
}


document.getElementById('toggleChatList').addEventListener('click', function() {
    var chatList = document.getElementById('chatList');
    if (chatList.classList.contains('d-none')) {
        chatList.classList.remove('d-none');
    } else {
        chatList.classList.add('d-none');
    }
});


async function loadHistory(conversationId) {
    localStorage.setItem('conversationId', conversationId);
    // Gửi yêu cầu để lấy lịch sử cho conversationId
    try {
        const response = await fetch(`http://localhost:4000/q-and-a/conversations/${conversationId}`);
        if (!response.ok) throw new Error(`Network response was not ok:  ${response.statusText}`);

        var chatList = document.getElementById('chatList');
        if (chatList.classList.contains('d-none')) {
            chatList.classList.remove('d-none');
        } else {
            chatList.classList.add('d-none');
        }

        const history = await response.json();

        // Lấy phần tử chatBox
        var chatBox = document.getElementById('chatBox');
        chatBox.innerHTML = ''; // Xóa nội dung hiện tại

        // Lặp qua lịch sử và thêm vào chatBox
        history.forEach(function(message) {
            var messageDiv = document.createElement('div');
            
            // Kiểm tra xem tin nhắn từ người dùng hay bot
            if (message.startsWith('User:')) {
                messageDiv.classList.add('message', 'user'); // Thêm lớp cho tin nhắn của người dùng
                messageDiv.innerHTML = '<div class="content">' + message.replace('User: ', '') + '</div>'; // Loại bỏ "User: "
            } else if (message.startsWith('System:')) {
                messageDiv.classList.add('message', 'bot'); // Thêm lớp cho tin nhắn của bot
                messageDiv.innerHTML = '<div class="content">' + message.replace('System: ', '') + '</div>'; // Loại bỏ "System: "
            }

            // Thêm messageDiv vào chatBox
            chatBox.appendChild(messageDiv);
        });

        // Cuộn xuống để xem tin nhắn mới
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error('Error loading history:', error);
    }
}

async function createNewChat(userID) {
    var chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = ''; // Xóa nội dung hiện tại

    try {
        // Gửi yêu cầu tạo cuộc hội thoại mới
        const response = await fetch('http://localhost:4000/q-and-a/conversations/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserID: userID,
                Title: 'New Chat', 
                History: [] 
            }),
        });

        if (!response.ok) {
            throw new Error('Error creating new chat: ' + response.statusText);
        }

        const data = await response.json(); // Nhận dữ liệu từ server

        // Create a new chat-list-item and add it to the top of the chat list
        const chatList = document.querySelector('.list-group');
        
        const newChatItem = document.createElement('div');
        newChatItem.classList.add('d-flex', 'justify-content-between', 'list-group-item', 'list-group-item-action');

        const newChatLink = document.createElement('a');
        newChatLink.href = '#';
        newChatLink.classList.add('chat-list-item');
        newChatLink.setAttribute('data-id', data._id); // Use the new chat's ID
        newChatLink.textContent = data.Title; // Display the chat title
        newChatLink.onclick = () => loadHistory(data._id); // Set click event to load history
        
        const deleteIcon = document.createElement('a');
        deleteIcon.href = '';
        deleteIcon.setAttribute('data-bs-toggle', 'tooltip');  // Added data-bs-toggle
        deleteIcon.setAttribute('title', 'Delete');
        deleteIcon.classList.add('mx-2', 'my-auto', 'text-danger', 'delete-history');
        deleteIcon.setAttribute('data-id', data._id);
        deleteIcon.innerHTML = '<i class="bi bi-trash"></i>';
        deleteIcon.onclick = () => deleteConversation(data._id);
        
        newChatItem.appendChild(newChatLink);
        newChatItem.appendChild(deleteIcon);

        // Insert the new chat item at the top of the list
        chatList.insertBefore(newChatItem, chatList.firstChild);

        // Automatically click on the new chat item to load it
        newChatLink.click();

        toggleChatList = document.getElementById('toggleChatList');
        toggleChatList.click();

        // Có thể hiển thị thông báo hoặc làm gì đó với dữ liệu cuộc trò chuyện mới
    } catch (error) {
        console.error('Error creating new chat:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var firstChatItem = document.querySelector('.chat-list-item');
    var chatList = document.getElementById('toggleChatList');
    if (firstChatItem) {
        // Tự động kích hoạt click vào phần tử đầu tiên
        firstChatItem.click();
        chatList.click();
    }
    else {
        var newChat = document.getElementById('newChat');
        newChat.click();
    }
});

async function deleteConversation(id) {
    try {
        let res = await fetch(`/q-and-a/conversations/${id}`, {
            method: "DELETE",
        });

        if (res.status == 200) {
            location.reload();
        } else {
            let resText = await res.text();
            throw new Error(resText);
        }
    } catch (error) {
        let toast = new bootstrap.Toast(document.querySelector(".toast"), {});
        let toastBody = document.querySelector(".toast .toast-body");

        toastBody.innerHTML = "Can not delete conversation";
        toastBody.classList.add("text-danger");
        toast.show();

        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-history');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const conversationID = this.getAttribute('data-id');
            console.log(conversationID)
            // const options = {
            //     title: "Are you sure?",
            //     type: "danger",
            //     btnOkText: "Yes",
            //     btnCancelText: "No",
            //     onConfirm: () => {
            //         // console.log(id);
            //         deleteConversation(conversationID);
            //     },
            //     onCancel: () => {
            //         console.log("Deletion canceled.");
            //     },
            // };
    
            // const { el, content, options: confirmedOptions } = bs5dialog.confirm(
            //     "Do you really want to delete this conversation?",
            //     options
            // );
            deleteConversation(conversationID);
        });
    });
});