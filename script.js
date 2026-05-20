document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const menuLinks = document.querySelectorAll('.nav-menu ul li a');

    // Клик по бургеру (захищено від помилок через "if")
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Обработка отправки формы
    const bookingForm = document.getElementById('bookingForm'); 
    if (bookingForm) { // Ця перевірка рятує головну сторінку від падіння!
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const btn = bookingForm.querySelector('.submit-btn');
            const originalText = btn ? btn.innerText : "Підтвердити";
            if (btn) btn.innerText = "Відправка...";

            const token = "8619653075:AAFjQ8rzhTqXlDV3gmWl_IZVopxk1B2c0ak";
            const chatId = "6299034881";
            
            // Зчитуємо дані безпечно
            const serviceField = bookingForm.querySelector('[name="service"]');
            const nameField = bookingForm.querySelector('[name="name"]');
            const phoneField = bookingForm.querySelector('[name="phone"]');
            const dateField = bookingForm.querySelector('[name="date"]');
            const timeField = bookingForm.querySelector('[name="time"]');
            const commentField = bookingForm.querySelector('[name="comment"]');

            const serviceVal = serviceField ? serviceField.value : "Не вказано";
            const nameVal = nameField ? nameField.value : "Не вказано";
            const phoneVal = phoneField ? phoneField.value : "Не вказано";
            const dateVal = dateField ? dateField.value : "Не вказано";
            const timeVal = timeField ? timeField.value : "Не вказано";
            const commentVal = commentField ? commentField.value : "-";

            const text = `🔔 Нова заявка!%0A` +
                         `👤 Ім'я: ${encodeURIComponent(nameVal)}%0A` +
                         `📞 Телефон: ${encodeURIComponent(phoneVal)}%0A` +
                         `✂️ Послуга: ${encodeURIComponent(serviceVal)}%0A` +
                         `📅 Дата: ${encodeURIComponent(dateVal)}%0A` +
                         `⏰ Час: ${encodeURIComponent(timeVal)}%0A` +
                         `💬 Коментар: ${encodeURIComponent(commentVal)}`;

            try {
                const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`);
                
                if (response.ok) {
                    closeModal(); 
                    const successModal = document.getElementById('success-modal');
                    if (successModal) {
                        successModal.style.display = 'flex';
                    }
                    bookingForm.reset();
                } else {
                    alert('Помилка відправки. Перевір токен або налаштування бота.');
                }
            } catch (err) {
                alert('Помилка мережі: ' + err.message);
            } finally {
                if (btn) btn.innerText = originalText;
            }
        });
    }
});

// Функції модального вікна
function openModal(serviceValue) {
    const modal = document.getElementById("bookingModal");
    const select = document.getElementById("service");

    if (select && serviceValue) {
        select.value = serviceValue;
    }

    if (modal) {
        modal.style.display = "flex"; 
        document.body.style.overflow = "hidden"; 
    }
}

function closeModal() {
    const modal = document.getElementById("bookingModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; 
    }
}

function closeSuccessModal() {
    const successModal = document.getElementById("success-modal");
    if (successModal) {
        successModal.style.display = "none";
    }
}

// Закрытие при клике вне окна
window.onclick = function(event) {
    const modal = document.getElementById("bookingModal");
    const successModal = document.getElementById("success-modal");
    
    if (event.target == modal) {
        closeModal();
    }
    if (event.target == successModal) {
        closeSuccessModal();
    }
}