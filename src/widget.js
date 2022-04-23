export class ArtemisWidget {
  constructor(userId, chatbotId, tagline) {
    this.isFormOpen = false;
    this.formState = {};

    this.applyStyles();
    this.createWidgetContainer();
    this.createToggleChatButton();

    this.userId = userId;
    this.chatbotId = chatbotId;
    this.tagline = tagline;
  }

  async getFormData() {
    const response = await fetch(
      `http://localhost:3000/api/chatbot/use/${this.userId}/${this.chatbotId}`
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

    // base video
    const openChatbotDiv = document.createElement("div");

    const chatbotBaseVideo = document.createElement("video");
    chatbotBaseVideo.src =
      "https://buildarassets.s3.amazonaws.com/1650618797.0980403.mp4";
    chatbotBaseVideo.autoplay = true;
    chatbotBaseVideo.muted = true;
    chatbotBaseVideo.loop = true;
    openChatbotDiv.appendChild(chatbotBaseVideo);

    const taglineText = document.createElement("p");
    taglineText.innerText = this.tagline;
    openChatbotDiv.appendChild(taglineText);

    // close chatbot image
    const closeChatbotImage = document.createElement("img");
    closeChatbotImage.src =
      "https://img.icons8.com/ios/50/000000/delete-sign--v1.png";
    closeChatbotImage.classList.add("artemis-widget-toggle-chat-image");

    // add UI to close/open depending on current state
    this.isFormOpen
      ? toggleChatButton.appendChild(closeChatbotImage)
      : toggleChatButton.appendChild(openChatbotDiv);
  }

  changeFormState(event) {
    const currentInput = { [event.target.name]: event.target.value };
    this.formState = { ...this.formState, ...currentInput };
  }

  renderQuestion(question) {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("artemis-widget-question-container");

    const videoElement = document.createElement("video");
    videoElement.src = question.videoLink;
    videoElement.setAttribute("autoplay", " ");
    videoElement.classList.add("artemis-widget-video-element");
    questionContainer.appendChild(videoElement);

    switch (question.options.length) {
      case 0:
        const textLabel = document.createElement("label");
        textLabel.setAttribute("for", question.name);
        textLabel.innerText = question.text;
        questionContainer.appendChild(textLabel);

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.name = question.name;
        textInput.onchange = (e) => {
          this.changeFormState(e);
        };
        questionContainer.appendChild(textInput);
        break;

      default:
        const radioText = document.createElement("p");
        radioText.innerText = question.text;
        questionContainer.appendChild(radioText);

        for (let radioOption of question.options) {
          const radioContainer = document.createElement("div");

          const radioInput = document.createElement("input");
          radioInput.type = "radio";
          radioInput.name = question.name;
          radioInput.value = radioOption.text;
          radioInput.onchange = (e) => {
            this.changeFormState(e);
          };

          const radioLabel = document.createElement("label");
          radioLabel.setAttribute("for", radioOption.text);
          radioLabel.innerText = radioOption.text;

          radioContainer.appendChild(radioInput);
          radioContainer.appendChild(radioLabel);

          questionContainer.appendChild(radioContainer);
        }
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
      `http://localhost:3000/api/chatbot/answer/${this.chatbotId}`,
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
        overflow-y: auto;
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
        font-size: 1.1rem;
      }

      .artemis-widget-form-element input {
        padding: 0.5em 1em;
        margin-top: 1em;
        font-size: 1.3rem;
      }

      .artemis-widget-question-container {
        padding: 1rem 0;
        display: flex;
        flex-direction: column; 
      }

      .artemis-widget-video-element {
        width: 100%;
      }
    `;
    document.head.appendChild(styleTag);
  }
}
