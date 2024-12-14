document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messagesDiv = document.getElementById('messages');

    // 从后端 API 加载留言
    function loadMessages() {
        messagesDiv.innerHTML = ''; // 清空消息容器
        fetch('http://localhost:3000/api/messages')
            .then(response => response.json())
            .then(messages => {
                messages.reverse(); // 反转留言数组，使最新的留言在最前面
                messages.forEach((message, index) => {
                    displayMessage(message.text, message.date, index); // 显示留言和日期
                });
            })
            .catch(error => console.error('Error loading messages:', error));
    }

    // 显示留言
    function displayMessage(messageText, messageDate, index) {
        const messageElem = document.createElement('div');
        messageElem.classList.add('message');
        messageElem.dataset.index = index; // 记录索引，用于删除

        // 创建留言内容部分
        const textElem = document.createElement('div');
        const processedText = marked.parse(messageText); // 使用 marked 处理整体留言文本
        const safeHTML = DOMPurify.sanitize(processedText); // 使用 DOMPurify 确保安全
        textElem.innerHTML = safeHTML; // 设置处理过的内容
        messageElem.appendChild(textElem);

        // 创建日期部分
        const dateElem = document.createElement('div');
        dateElem.classList.add('message-date');
        dateElem.textContent = messageDate; // 显示日期
        messageElem.appendChild(dateElem);

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function () {
            deleteMessage(index, messageElem); // 点击删除按钮时调用删除函数，并传入元素
        };
        messageElem.appendChild(deleteButton); // 将按钮添加到留言中

        messagesDiv.insertBefore(messageElem, messagesDiv.firstChild);
    }

    function deleteMessage(index, messageElem) {
        fetch(`http://localhost:3000/api/messages/${index}`, {
            method: 'DELETE'
        })
            .then(() => {
                location.reload(); // 删除后刷新页面
            })
            .catch(error => console.error('Error deleting message:', error));
    }

    messageForm.addEventListener('submit', function (event) {
        event.preventDefault(); // 防止表单默认提交行为

        const messageText = messageInput.value.trim(); // 获取并去除输入的留言前后的空格
        if (messageText === '') {
            alert('留言不能为空！'); // 提醒用户输入内容
            return; // 终止函数执行
        }

        const messageDate = new Date().toLocaleDateString('zh-CN'); // 获取日期

        // 保存留言到后端 API
        fetch('http://localhost:3000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: messageText, date: messageDate })
        })
            .then(response => response.json())
            .then(newMessage => {
                location.reload(); // 添加留言后刷新页面
            })
            .catch(error => console.error('Error adding message:', error));
    });

    // 页面加载时加载留言
    loadMessages();
});
