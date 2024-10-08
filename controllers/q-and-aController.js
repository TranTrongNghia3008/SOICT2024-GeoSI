'use strict';

const controller = {};


controller.show = async (req, res) => {
    try {
        const user = req.user;
        // Gửi dữ liệu tới view
        res.render('q-and-a', {
            user,
            title: "GeoSI - Q and A",
            d1: "selected-menu-item",
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = controller;
