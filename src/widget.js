export class ArtemisWidget {
  constructor() {
    this.isFormOpen = false;
    this.formState = {};

    this.applyStyles();
    this.createWidgetContainer();
    this.createToggleChatButton();
  }

  async getFormData() {
    const response = await fetch(
      "http://localhost:3000/api/widget/62176db319ede44b9682f105"
    );
    const json = await response.json();
    return json;
  }

  async handleToggleChatButtonClick() {
    this.isFormOpen = !this.isFormOpen;
    this.toggleChatButton.remove();
    this.createToggleChatButton();

    if (this.isFormOpen) {
      this.data = await this.getFormData();
      this.createFormElement();
    } else {
      this.formContainer.remove();
    }
  }

  createWidgetContainer() {
    // widget container
    const artemisWidgetContainer = document.createElement("div");
    this.artemisWidgetContainer = artemisWidgetContainer;
    artemisWidgetContainer.classList.add("artemis-widget-container");
    document.body.appendChild(artemisWidgetContainer);
  }

  createToggleChatButton() {
    // chat open button
    const toggleChatButton = document.createElement("div");
    this.toggleChatButton = toggleChatButton;
    toggleChatButton.classList.add("artemis-widget-toggle-chat-button");
    toggleChatButton.onclick = () => {
      this.handleToggleChatButtonClick();
    };
    this.artemisWidgetContainer.appendChild(toggleChatButton);

    // chat image in chat open button
    const toggleChatImage = document.createElement("img");
    toggleChatImage.src = this.isFormOpen
      ? "https://img.icons8.com/ios/50/000000/delete-sign--v1.png"
      : "https://img.icons8.com/ios/50/000000/chat--v1.png";
    toggleChatImage.classList.add("artemis-widget-toggle-chat-image");
    toggleChatButton.appendChild(toggleChatImage);
  }

  changeFormState(event) {
    const currentInput = { [event.target.name]: event.target.value };
    this.formState = { ...this.formState, ...currentInput };
  }

  renderQuestion(question) {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("artemis-widget-question-container");

    const videoElement = document.createElement("video");
    videoElement.src = question.src;
    videoElement.setAttribute("autoplay", " ");
    videoElement.classList.add("artemis-widget-video-element");
    questionContainer.appendChild(videoElement);

    switch (question.type) {
      case "text":
        const textLabel = document.createElement("label");
        textLabel.setAttribute("for", question.label);
        textLabel.innerText = question.caption;
        questionContainer.appendChild(textLabel);

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.name = question.label;
        textInput.onchange = (e) => {
          this.changeFormState(e);
        };
        questionContainer.appendChild(textInput);
        break;

      case "radio":
        const radioText = document.createElement("p");
        radioText.innerText = question.caption;
        questionContainer.appendChild(radioText);

        for (let radioOption of question.options) {
          const radioContainer = document.createElement("div");

          const radioInput = document.createElement("input");
          radioInput.type = "radio";
          radioInput.name = question.label;
          radioInput.value = radioOption;
          radioInput.onchange = (e) => {
            this.changeFormState(e);
          };

          const radioLabel = document.createElement("label");
          radioLabel.setAttribute("for", radioOption);
          radioLabel.innerText = radioOption;

          radioContainer.appendChild(radioInput);
          radioContainer.appendChild(radioLabel);

          questionContainer.appendChild(radioContainer);
        }
        break;

      default:
        break;
    }

    this.formElement.prepend(questionContainer);
    return questionContainer;
  }

  *getQuestionNumber() {
    for (
      let questionNumber = 0;
      questionNumber <= this.data.questions.length;
      ++questionNumber
    ) {
      yield questionNumber;
    }
  }

  createSubmitButton() {
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.type = "Submit";
    this.formElement.appendChild(submitButton);
  }

  renderNextQuestion(proceedButton, questionNumber) {
    if (!questionNumber.done) {
      proceedButton.innerText = "Next";
      return this.renderQuestion(this.data.questions[questionNumber.value]);
    }
  }

  handleProceedClick(proceedButton, questionNumberGenerator) {
    const questionNumber = questionNumberGenerator.next();

    if (questionNumber.value === this.data.questions.length - 1) {
      proceedButton.remove();
      this.createSubmitButton();
    }

    if (this.lastQuestion) this.lastQuestion.remove();
    this.lastQuestion = this.renderNextQuestion(proceedButton, questionNumber);
  }

  createThankYouElement() {
    const thankYouParagraph = document.createElement("p");
    thankYouParagraph.innerText = "Thank you for filling out the form!";
    this.formContainer.appendChild(thankYouParagraph);
  }

  async submitForm(event) {
    event.preventDefault();
    const response = await fetch(
      "http://localhost:3000/api/widget/62176db319ede44b9682f105",
      {
        method: "POST",
        body: JSON.stringify(this.formState),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const json = await response.json();
    console.log(json);

    this.formElement.remove();
    this.createThankYouElement();
  }

  createFormElement() {
    const formContainer = document.createElement("div");
    this.formContainer = formContainer;
    formContainer.classList.add("artemis-widget-form-container");
    this.artemisWidgetContainer.prepend(formContainer);

    // form element
    const formElement = document.createElement("form");
    this.formElement = formElement;
    formElement.id = "artemis-widget-form";
    formElement.onsubmit = (e) => {
      this.submitForm(e);
    };
    formElement.classList.add("artemis-widget-form-element");
    formContainer.appendChild(formElement);

    // question number generator
    const questionNumberGenerator = this.getQuestionNumber();

    // Move next
    const proceedButton = document.createElement("button");
    proceedButton.type = "button";
    proceedButton.innerText = "Start";
    proceedButton.onclick = (e) => {
      this.handleProceedClick(proceedButton, questionNumberGenerator);
    };
    formElement.appendChild(proceedButton);
  }

  applyStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      :root {
        --blue: #4285F4;
        --yellow: #FBBC05;
        --green: #34A853;
        --red: #EA4335;
      }

      .artemis-widget-container {
        position: fixed;
        right: 10px;
        bottom: 10px;
      }

      .artemis-widget-toggle-chat-button {
        cursor: pointer;
        position: relative;
        margin-top: auto;
        margin-left: auto;
        width: 5vw;
        max-width: 50px;
        height: 5vw;
        max-height: 50px;
        padding: 1rem;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid black;
        z-index: 1;
      }

      .artemis-widget-toggle-chat-button:hover {
        box-shadow: 0 0 10px 0 rgb(219 219 219 / 75%), 0 2px 10px 0 rgb(173 158 158);
      }

      .artemis-widget-toggle-chat-image {
        width: 90%;
      }

      .artemis-widget-card {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .artemis-widget-form-container {
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgb(163 163 163), 0 2px 10px 0 rgb(70 70 70);
        height: 500px;
        width: 500px;
        padding: 1rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .artemis-widget-form-container button {
        padding: 1rem 3rem;
        font-size: 1.3rem;
        background: var(--blue);
        border-radius: 10px;
        color: white;
        border: none;
        cursor: pointer;
      }

      .artemis-widget-form-element {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .artemis-widget-question-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }

      .artemis-widget-video-element {
        width: 100%;
      }
    `;
    document.head.appendChild(styleTag);
  }
}
