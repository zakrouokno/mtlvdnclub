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
// ФУНКЦІЯ ДЛЯ ПЛАВНОГО РОЗГОРТАННЯ FAQ
function toggleFaq(element) {
    const answer = element.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');
    
    // Перевіряємо, чи цей пункт уже відкритий
    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        element.style.borderColor = '#f8b3c6';
    } else {
        // Закриваємо всі інші відкриті питання (опціонально, для краси)
        document.querySelectorAll('.faq-answer').forEach(el => el.style.maxHeight = '0px');
        document.querySelectorAll('.faq-icon').forEach(el => el.style.transform = 'rotate(0deg)');
        document.querySelectorAll('.faq-item').forEach(el => el.style.borderColor = '#f8b3c6');
        
        // Відкриваємо поточний пункт
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(45deg)'; // Плюсик красиво перетворюється на хрестик
        element.style.borderColor = '#a65e64'; // Рамка стає трохи темнішою
    }
}
// ЧЕКАЄМО ЗАВАНТАЖЕННЯ СТОРІНКИ
document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. РОЗУМНЕ БЛОКУВАННЯ ДАТ ТА ЧАСУ ---
    const dateInput = document.querySelector('input[name="date"]');
    const timeInput = document.querySelector('input[name="time"]');
    const bookingForm = document.getElementById('bookingForm');

    if (dateInput) {
        // Встановлюємо мінімальну дату (сьогодні)
        const today = new Date();
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

            // Перевірка 1: Якщо обрано сьогодні, час не має бути в минулому
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

    // --- 2. АВТО-ВЕЛИКА ЛІТЕРА В ІМЕНІ ---
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput) {
        nameInput.addEventListener('input', function () {
            if (this.value.length > 0) {
                // Робимо першу літеру великою
                this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
            }
        });
    }

    // --- 3. ЗАХИСТ ВІД СТИРАННЯ ДАНИХ ПРИ ЗАКРИТТІ ---
    // Модалка тепер просто ховається (display: none), але поля форми НЕ очищуються автоматично,
    // тому дані залишаються на місці, поки сторінка не оновиться або форма не відправиться!
});

// --- ГЛОБАЛЬНІ ФУНКЦІЇ ДЛЯ МОДАЛЬНОГО ВІКНА ---
function openModal(serviceName = "") {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active'); // або modal.style.display = 'flex'; в залежності від твоїх стилів
        modal.style.display = 'flex';
        
        // Якщо передано конкретну послугу з картки — підставляємо її в селект
        if (serviceName) {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                // Шукаємо опцію, яка містить назву послуги
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
        // Ми НЕ очищуємо форму тут, щоб зберегти дані дівчинки, якщо вона випадково закрила вікно!
    }
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.style.display = 'none';
    }
}

// Очищення форми робимо ТІЛЬКИ після успішної відправки
const bForm = document.getElementById('bookingForm');
if (bForm) {
    bForm.addEventListener('submit', function(e) {
        // Тут твій код відправки форми (наприклад, в телеграм чи на пошту)
        // Після успішної відправки вікно успіху відкривається, а форма скидається:
        // document.getElementById('success-modal').style.display = 'flex';
        // bForm.reset(); 
    });
}
// НАДЁЖНОЕ ОТКРЫТИЕ ВСЕЙ ВКЛАДКИ НА ТЕЛЕФОНАХ
function toggleGlobalFaq(buttonElement) {
    buttonElement.classList.toggle('active');
    const container = document.getElementById('global-faq-container');
    const icon = document.getElementById('main-faq-icon');
    
    if (container.style.maxHeight && container.style.maxHeight !== '0px') {
        container.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        buttonElement.style.borderColor = '#f8b3c6';
    } else {
        container.style.maxHeight = container.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
        buttonElement.style.borderColor = '#a65e64';
    }
}

// НАДЁЖНОЕ ОТКРЫТИЕ ОТДЕЛЬНЫХ ВОПРОСОВ НА ТЕЛЕФОНАХ
function toggleMobileFaq(element) {
    const answer = element.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');
    const globalContainer = document.getElementById('global-faq-container');
    
    // Закрываем все остальные открытые вопросы перед открытием нового
    document.querySelectorAll('.faq-answer').forEach(el => el.style.maxHeight = '0px');
    document.querySelectorAll('.faq-icon').forEach(el => el.style.transform = 'rotate(0deg)');
    document.querySelectorAll('.faq-item').forEach(el => el.style.borderColor = '#f8b3c6');

    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        element.style.borderColor = '#f8b3c6';
    } else {
        // Открываем текущий ответ
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(45deg)';
        element.style.borderColor = '#a65e64';
        
        // САМАЯ ВАЖНАЯ СТРОКА: Расширяем высоту главного контейнера, чтобы текст на телефоне не обрезался!
        if (globalContainer) {
            globalContainer.style.maxHeight = (globalContainer.scrollHeight + answer.scrollHeight) + 'px';
        }
    }
}
