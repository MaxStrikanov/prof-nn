
const openModal = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.querySelector(".header__btn");
    const modal = document.getElementById("callback-modal");
    const closeTriggers = modal.querySelectorAll("[data-modal-close]");
    const form = document.getElementById("callback-form");

    function openModal() {
      modal.classList.add("modal--open");
      document.body.classList.add("no-scroll");
    }

    function closeModal() {
      modal.classList.remove("modal--open");
      document.body.classList.remove("no-scroll");
    }

    if (openBtn) {
      openBtn.addEventListener("click", openModal);
    }

    closeTriggers.forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("modal--open")) {
        closeModal();
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Тут можно подключить ajax/fetch
      // const formData = new FormData(form);
      // fetch("/send-form", { method: "POST", body: formData });

      console.log("Имя:", form.name.value);
      console.log("Телефон:", form.phone.value);
      console.log("Согласие:", form.agree.checked);

      // Закрыть модалку после отправки
      closeModal();
      form.reset();
    });
  });
};



export default openModal;



