document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messagesDiv = document.getElementById('messages');

    // 从 localStorage 加载留言
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.reverse(); // 反转留言数组，使最新的留言在最前面
        messages.forEach((message, index) => {
            displayMessage(message.text, message.date, index); // 显示留言和日期
        });
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

        messagesDiv.appendChild(messageElem);
    }

    function deleteMessage(index, messageElem) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.splice(index, 1); // 删除指定索引的留言
        localStorage.setItem('messages', JSON.stringify(messages)); // 更新 localStorage
        
        messagesDiv.removeChild(messageElem); // 仅移除对应的留言元素
    }

    messageForm.addEventListener('submit', function (event) {
        event.preventDefault(); // 防止表单默认提交行为

        const messageText = messageInput.value.trim(); // 获取并去除输入的留言前后的空格
        if (messageText === '') {
            alert('留言不能为空！'); // 提醒用户输入内容
            return; // 终止函数执行
        }

        const messageDate = new Date().toLocaleDateString('zh-CN'); // 获取日期
        displayMessage(messageText, messageDate, messagesDiv.children.length); // 显示留言和日期

        // 保存留言到 localStorage
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({ text: messageText, date: messageDate }); // 存储留言和日期
        localStorage.setItem('messages', JSON.stringify(messages));
        
        messageInput.value = ''; // 清空输入框
    });

    // 页面加载时加载留言
    loadMessages();
});
