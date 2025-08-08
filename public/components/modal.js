function getUTMParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};
  urlParams.forEach((value, key) => {
    if (key.startsWith("utm_")) {
      utmParams[key.toUpperCase()] = value;
    }
  });
  return utmParams;
}


const sendLeadToBitrix = (formData) => {
  const url = 'https://scenapro.bitrix24.ru/rest/9578/9sge3ln4bmhj2ewn/crm.lead.add.json';

  const utmParams = getUTMParameters();

  const leadData = {
    fields: {
      TITLE: 'Заявка с сайта protribuny.ru',
      NAME: formData.name || '',
      PHONE: [{ VALUE: formData.phone || '', VALUE_TYPE: 'WORK' }],
      COMMENTS: formData.message || '',

      // UTM-метки
      UTM_SOURCE: utmParams.UTM_SOURCE || '',
      UTM_MEDIUM: utmParams.UTM_MEDIUM || '',
      UTM_CAMPAIGN: utmParams.UTM_CAMPAIGN || '',
      UTM_TERM: utmParams.UTM_TERM || '',
      UTM_CONTENT: utmParams.UTM_CONTENT || '',

      SOURCE_ID: 'WEB',
    },
    params: { REGISTER_SONET_EVENT: 'Y' },
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
        console.log('Лид успешно создан в Bitrix24, ID:', data.result);
        window.location.href = '/thanks.html';  // Перенаправление при успехе
      } else {
        console.error('Ошибка создания лида:', data);
      }
    })
    .catch(error => {
      console.error('Ошибка соединения с Bitrix24:', error);
    });
};




const openModal = () => {
  document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('registration');
    if (!modal) return;

    const modalText = modal.querySelector('.modal-form__text');
    const modalButton = modal.querySelector('.modal-form__form .primary__btn');
    const closeModalButton = modal.querySelector('.close');
    const form = document.querySelector('.modal-form__form');

    // Проверка на все необходимые элементы
    if (!modalText || !modalButton || !closeModalButton) return;

    // ===== Обработка отправки формы =====
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';

        const formData = { name, phone };
        sendLeadToBitrix(formData);

        // Опционально:
        // form.reset();
        // modal.classList.remove('active');
      });
    }

    // ===== Конфигурации по ID =====
    const modalConfigs = [
      { id: 'headerBtn', text: 'И ответим на все вопросы', button: 'Заказать звонок проект-менеджера' },
      { id: 'price', text: 'Чтобы уточнить пожелания для расчета стоимости трибун', button: 'Получить расчет' },
      { id: 'visual', text: 'Чтобы уточнить пожелания и подготовить дизайн-проект', button: 'Получить визуализацию' },
      { id: 'getkp', text: 'Чтобы уточнить пожелания и подготовить коммерческое предложение', button: 'Получить КП' }
    ];

    const idButtons = ['price', 'getkp', 'visual', 'headerBtn'];

    idButtons.forEach(id => {
      const button = document.getElementById(id);
      if (button) {
        button.addEventListener('click', function (e) {
          e.preventDefault();
          const config = modalConfigs.find(item => item.id === id);

          if (config) {
            modalText.textContent = config.text;
            modalButton.textContent = config.button;
          }

          modal.classList.add('active');
        });
      }
    });

    // ===== Кнопки .tribune-types__button =====
    const tribuneButtons = document.querySelectorAll('.tribune-types__button');
    if (tribuneButtons.length > 0) {
      tribuneButtons.forEach(button => {
        button.addEventListener('click', function (e) {
          e.preventDefault();

          modalText.textContent = 'Чтобы уточнить пожелания и подготовить коммерческое предложение';
          modalButton.textContent = 'Получить расчет';

          modal.classList.add('active');
        });
      });
    }

    // ===== Кнопки .project-slide__button =====
    const projectButtons = document.querySelectorAll('.project-slide__button');
    if (projectButtons.length > 0) {
      projectButtons.forEach(button => {
        button.addEventListener('click', function (e) {
          e.preventDefault();

          modalText.textContent = 'Чтобы уточнить пожелания для подготовки коммерческого предложения';
          modalButton.textContent = 'Получить расчет';

          modal.classList.add('active');
        });
      });
    }

    // ===== Закрытие по кнопке =====
    if (closeModalButton) {
      closeModalButton.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // ===== Закрытие по фону =====
    window.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
};



export default openModal;



