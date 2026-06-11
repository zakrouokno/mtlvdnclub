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
    if (bookingForm) { 
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const btn = bookingForm.querySelector('.submit-btn');
            const originalText = btn ? btn.innerText : "Підтвердити";
            if (btn) btn.innerText = "Відправка...";

            const token = "8619653075:AAFjQ8rzhTqXlDV3gmWl_IZVopxk1B2c0ak";
            // Сделали массив из двух ID администраторов
            const chatIds = ["6299034881", "1131691925"];
            
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
                let allSuccessful = true;

                // Цикл отправки сообщения каждому администратору по очереди
                for (const chatId of chatIds) {
                    try {
                        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`);
                        if (!response.ok) {
                            allSuccessful = false;
                            console.error(`Ошибка отправки для ID: ${chatId}`);
                        }
                    } catch (fetchErr) {
                        allSuccessful = false;
                        console.error(`Ошибка сети при отправке для ID: ${chatId}`, fetchErr);
                    }
                }
                
                // Если хотя бы одному ушло успешно — считаем отправку выполненной
                if (allSuccessful) {
                    closeModal(); 
                    const successModal = document.getElementById('success-modal');
                    if (successModal) {
                        successModal.style.display = 'flex';
                    }
                    bookingForm.reset();
                } else {
                    alert('Помилка відправки. Перевір токен, ID або налаштування бота.');
                }
            } catch (err) {
                alert('Помилка мережі: ' + err.message);
            } finally {
                if (btn) btn.innerText = originalText;
            }
        });

        // Находим элементы для валидации даты и времени (чтобы код ниже не ломался)
        const today = new Date();
        const dateInput = bookingForm.querySelector('[name="date"]');
        const timeInput = bookingForm.querySelector('[name="time"]');

        if (dateInput && timeInput) {
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1;
            let dd = today.getDate();

            if (mm < 10) mm = '0' + mm;
            if (dd < 10) dd = '0' + dd;

            const todayString = `${yyyy}-${mm}-${dd}`;
            dateInput.setAttribute('min', todayString);

            // Функція перевірки часу
            function validateTime() {
                if (!timeInput.value) return true;

                const selectedDate = dateInput.value;
                const selectedTime = timeInput.value;
                
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                const currentTimeString = `${currentHour < 10 ? '0' + currentHour : currentHour}:${currentMinute < 10 ? '0' + currentMinute : currentMinute}`;

                // Перевірка: Якщо обрано сьогодні, час не має бути в минулому
                if (selectedDate === todayString && selectedTime < currentTimeString) {
                    alert("Ой, цей час на сьогодні вже минув. Будь ласка, оберіть пізніший час або інший день! ✨");
                    timeInput.value = "";
                    return false;
                }
                return true;
            }

            // Слідкуємо за зміною дати та часу
            dateInput.addEventListener('change', validateTime);
            timeInput.addEventListener('change', validateTime);
        }
    }

    // --- 2. АВТО-ВЕЛИКА ЛІТЕРА В ІМЕНІ ---
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput) {
        nameInput.addEventListener('input', function () {
            if (this.value.length > 0) {
                this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
            }
        });
    }
});

// --- ГЛОБАЛЬНІ ФУНКЦІЇ ДЛЯ МОДАЛЬНИХ ВІКОН ---
function openModal(serviceName = "") {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = "hidden"; 
        
        if (serviceName) {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                for (let option of serviceSelect.options) {
                    if (option.value.includes(serviceName)) {
                        serviceSelect.value = option.value;
                        break;
                    }
                }
            }
        }
    }
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = "auto"; 
    }
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.style.display = 'none';
    }
}

// Залізобетонна мобільна функція для відкриття та закриття питань НА ОКРЕМІЙ СТОРІНЦІ
function togglePageFaq(element) {
    if (!element) return;
    const answer = element.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');
    
    if (!answer) return;

    const isCurrentOpen = element.classList.contains('faq-item-open');

    // Сворачиваем вообще все остальные открытые вопросы
    document.querySelectorAll('.faq-item').forEach(el => {
        const ans = el.querySelector('.faq-answer');
        const ic = el.querySelector('.faq-icon');
        if (ans) ans.style.maxHeight = '0px';
        if (ic) ic.style.transform = 'rotate(0deg)';
        el.style.borderColor = '#f8b3c6';
        el.classList.remove('faq-item-open');
    });

    // Если этот пункт был открыт — закрываем его
    if (isCurrentOpen) {
        answer.style.maxHeight = '0px';
        if (icon) icon.style.transform = 'rotate(0deg)';
        element.style.borderColor = '#f8b3c6';
        element.classList.remove('faq-item-open');
    } 
    // Если был закрыт — плавно открываем
    else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(45deg)';
        element.style.borderColor = '#a65e64';
        element.classList.add('faq-item-open');
    }
}

// Закриття при клікові поза модалкою
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
