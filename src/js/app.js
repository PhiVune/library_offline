// Đăng ký Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker đăng ký thành công:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker đăng ký thất bại:', error);
            });
    });
}

// Xử lý sự kiện click cho các category card
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.id;
        loadCategoryContent(category);
    });
});

// Hàm tải nội dung theo category
async function loadCategoryContent(category) {
    try {
        const response = await fetch(`/content/${category}/index.json`);
        const data = await response.json();
        displayContent(data);
    } catch (error) {
        console.error('Lỗi khi tải nội dung:', error);
        showError('Không thể tải nội dung. Vui lòng thử lại sau.');
    }
}

// Hàm hiển thị nội dung
function displayContent(data) {
    const main = document.querySelector('main');
    const contentSection = document.createElement('section');
    contentSection.className = 'content-section';
    
    data.items.forEach(item => {
        const contentCard = createContentCard(item);
        contentSection.appendChild(contentCard);
    });

    // Xóa nội dung cũ và thêm nội dung mới
    const oldContent = document.querySelector('.content-section');
    if (oldContent) {
        oldContent.remove();
    }
    main.appendChild(contentSection);
}

// Hàm tạo card nội dung
function createContentCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    
    card.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="content-actions">
            <button onclick="viewContent('${item.id}')">Xem</button>
            <button onclick="downloadContent('${item.id}')">Tải xuống</button>
        </div>
    `;
    
    return card;
}

// Hàm xem nội dung
function viewContent(contentId) {
    // TODO: Implement content viewer
    console.log('Xem nội dung:', contentId);
}

// Hàm tải xuống nội dung
function downloadContent(contentId) {
    // TODO: Implement content download
    console.log('Tải xuống nội dung:', contentId);
}

// Hàm hiển thị lỗi
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Kiểm tra trạng thái kết nối
window.addEventListener('online', () => {
    console.log('Đã kết nối internet');
});

window.addEventListener('offline', () => {
    console.log('Mất kết nối internet');
    showError('Bạn đang ở chế độ offline. Một số tính năng có thể không khả dụng.');
}); 