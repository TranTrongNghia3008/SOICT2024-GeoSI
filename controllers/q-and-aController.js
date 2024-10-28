'use strict';

const ConversationSession = require('../models/conversationSessionModel'); // Import model

const controller = {};

controller.show = async (req, res) => {
    try {
        const userId = req.user._id; // Lấy ID người dùng từ req.user
        // Tìm kiếm các phiên trò chuyện của người dùng
        const conversations = await ConversationSession.find({ UserID: userId }).select('Title _id').sort({ updatedAt: -1 }); // Chọn Title và _id

        // Gửi dữ liệu tới view
        res.render('q-and-a', {
            user: req.user,
            title: "GeoSI - Q and A",
            d1: "selected-menu-item",
            conversations // Gửi danh sách phiên trò chuyện tới view
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

controller.getHistory = async (req, res) => {
    try {
        const id = req.params.id
        const conversation = await ConversationSession.findById(id);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        res.json(conversation.History);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

controller.createNewChat = async (req, res) => {
    try {
        const { UserID, Title, History } = req.body;
        // Tạo một cuộc hội thoại mới
        const newSession = new ConversationSession({
            UserID,
            Title,
            History,
        });

        // Lưu vào MongoDB
        const savedSession = await newSession.save();

        // Gửi phản hồi lại cho client
        res.status(201).json(savedSession);
    } catch (error) {
        console.error('Error creating new chat session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

controller.deleteConversation = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await ConversationSession.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: 'Conversation deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Conversation not found.' });
        }
    } catch (error) {
        console.error('Error deleting Conversation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

controller.updateHistory = async (req, res) => {
    const { history } = req.body;
    const id = req.params.id;

    try {
        const conversation = await ConversationSession.findById(id);
        if (!conversation) {
            return res.status(404).send('Conversation not found');
        }

        // Cập nhật lịch sử hội thoại
        conversation.History.push(...history);
        await conversation.save();

        res.status(200).send('History updated successfully');
    } catch (error) {
        console.error('Error updating history:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = controller;
