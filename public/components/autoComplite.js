export const autoComplite = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const DADATA_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
        const DADATA_TOKEN = '1e4a9102bdf3da4040f968c52262fd871f293e02';

        const addressInput = document.getElementById('modal-adres');
        const suggestionsBox = document.getElementById('address-suggestions');
        const modal = document.getElementById('callback-modal');

        let debounceTimer = null;

        function hideSuggestions() {
            suggestionsBox.innerHTML = '';
            suggestionsBox.classList.remove('suggestions--visible');
        }

        function showSuggestions(items) {
            if (!items || !items.length) {
                hideSuggestions();
                return;
            }

            suggestionsBox.innerHTML = '';

            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggestions__item';
                div.textContent = item.value; // основной формат адреса

                div.addEventListener('click', () => {
                    addressInput.value = item.value;
                    hideSuggestions();
                    addressInput.focus();
                });

                suggestionsBox.appendChild(div);
            });

            suggestionsBox.classList.add('suggestions--visible');
        }

        function fetchAddressSuggestions(query) {
            const options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Token ' + DADATA_TOKEN
                },
                body: JSON.stringify({
                    query: query,
                    count: 7 // сколько подсказок возвращать
                })
            };

            fetch(DADATA_URL, options)
                .then(response => response.json())
                .then(result => {
                    showSuggestions(result.suggestions || []);
                })
                .catch(error => {
                    console.error('DaData error:', error);
                    hideSuggestions();
                });
        }

        // Debounced ввод в поле
        addressInput.addEventListener('input', () => {
            const value = addressInput.value.trim();

            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            if (value.length < 3) {
                hideSuggestions();
                return;
            }

            debounceTimer = setTimeout(() => {
                fetchAddressSuggestions(value);
            }, 300);
        });

        // Прячем подсказки при потере фокуса (чуть с задержкой, чтобы успел сработать click по пункту)
        addressInput.addEventListener('blur', () => {
            setTimeout(hideSuggestions, 200);
        });

        // Клик по оверлею/крестику модалки тоже должен скрывать подсказки
        modal?.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('[data-modal-close]');
            if (closeBtn || e.target.classList.contains('modal__overlay')) {
                hideSuggestions();
            }
        });

        // На всякий случай: клик вне поля и списка
        document.addEventListener('click', (e) => {
            if (!modal.contains(e.target)) return; // реагируем только внутри модалки

            if (
                e.target !== addressInput &&
                !suggestionsBox.contains(e.target)
            ) {
                hideSuggestions();
            }
        });
    });
}