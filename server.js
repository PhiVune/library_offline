const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Phục vụ các file tĩnh từ thư mục src
app.use(express.static(path.join(__dirname, 'src')));

// Route mặc định
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
}); 