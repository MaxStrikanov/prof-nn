const qviz = () => {
  const quizData = {};
  const utmData = getUTMParameters();

  // ===== Обработка кликов по вариантам ответов =====
  const quizItems = document.querySelectorAll(".qviz__item");
  if (quizItems.length > 0) {
    quizItems.forEach((item) => {
      item.addEventListener("click", () => {
        const question = item.dataset.question;
        const answer = item.dataset.answer;
        const nextSlideId = item.dataset.next;

        const itemsGroup = item.closest(".qviz__items")?.querySelectorAll(".qviz__item");
        if (itemsGroup) {
          itemsGroup.forEach((el) => el.classList.remove("selected"));
        }

        item.classList.add("selected");

        if (question && answer) {
          quizData[question] = answer;
        }

        if (nextSlideId) {
          nextSlide(nextSlideId);
        }
      });
    });
  }

  // ===== Обработка кнопок "Пропустить" =====
  const nextButtons = document.querySelectorAll(".qviz__next_btn");
  if (nextButtons.length > 0) {
    nextButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextSlideId = btn.dataset.next;
        if (nextSlideId) {
          nextSlide(nextSlideId);
        }
      });
    });
  }

  // ===== Обработка формы =====
  const form = document.getElementById("query__form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const phoneInput = document.getElementById("phone");
      if (phoneInput) {
        quizData["Телефон"] = phoneInput.value;
      }

      document.querySelectorAll(".qviz").forEach((questionBlock) => {
        const questionText = questionBlock.querySelector(".qviz__title")?.textContent?.trim();
        const selected = questionBlock.querySelector(".qviz__item.selected");
        const answerText = selected?.querySelector("p")?.textContent?.trim();

        if (questionText && answerText) {
          quizData[questionText] = answerText;
        }
      });

      const combinedData = { ...quizData, ...utmData };
      sendToBitrix24(combinedData);
    });
  }
};

// ===== Хелперы =====
function nextSlide(slideId) {
  const slides = document.querySelectorAll(".qviz");
  if (slides.length > 0) {
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });
  }
  const targetSlide = document.getElementById(slideId);
  if (targetSlide) {
    targetSlide.classList.add("active");
  }
}

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

function sendToBitrix24(data) {
  const url = "https://scenapro.bitrix24.ru/rest/9578/9sge3ln4bmhj2ewn/crm.lead.add.json";
  const title = 'Заявка с сайта prosceny.ru (квиз)';
  const assigned = 327;

  const comments = [
    `Источник: ${title}`,
    `Телефон: ${data["Телефон"] || ""}`,
    `UTM Source: ${data["UTM_SOURCE"] || ""}`,
    `UTM Medium: ${data["UTM_MEDIUM"] || ""}`,
    `UTM Campaign: ${data["UTM_CAMPAIGN"] || ""}`,
    `UTM Content: ${data["UTM_CONTENT"] || ""}`,
    `UTM Term: ${data["UTM_TERM"] || ""}`,
    "Ответы на вопросы квиза:",
    ...Object.entries(data)
      .filter(([key]) => ![
        "Телефон", "Имя", "Электронная почта",
        "UTM_SOURCE", "UTM_MEDIUM", "UTM_CAMPAIGN",
        "UTM_CONTENT", "UTM_TERM"
      ].includes(key))
      .map(([question, answer]) => `${question}: ${answer}`)
  ].join("\n");

  const leadData = {
    fields: {
      TITLE: title,
      NAME: data["Имя"] || "",
      PHONE: [{ VALUE: data["Телефон"] || "", VALUE_TYPE: "WORK" }],
      EMAIL: [{ VALUE: data["Электронная почта"] || "", VALUE_TYPE: "WORK" }],
      COMMENTS: comments,
      ASSIGNED_BY_ID: assigned,
      UTM_SOURCE: data["UTM_SOURCE"] || "",
      UTM_MEDIUM: data["UTM_MEDIUM"] || "",
      UTM_CAMPAIGN: data["UTM_CAMPAIGN"] || "",
      UTM_CONTENT: data["UTM_CONTENT"] || "",
      UTM_TERM: data["UTM_TERM"] || "",
    }
  };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leadData),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.error) {
        console.error("Ошибка при отправке:", result.error_description);
        alert("Ошибка при отправке: " + result.error_description);
      } else {
        window.location.href = "/thanks.html";
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });
}

export default qviz;
