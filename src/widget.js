export class ArtemisWidget {
  constructor() {
    this.isFormOpen = false;
    this.formState = {};

    this.applyStyles();
    this.createToggleChatButton();
  }

  getFormData() {
    this.data = {
      questions: [
        {
          type: "text",
          src:
            "https://media.videoask.com/transcoded/2968e222-0105-4cf2-b81b-982a96cd3da8/video.mp4?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJtZWRpYV9pZCI6IjI5NjhlMjIyLTAxMDUtNGNmMi1iODFiLTk4MmE5NmNkM2RhOCIsImV4cCI6MTY0NjA5MTExNX0.0prOPRAJmQCP_rlQ-AiOcEzRCkgrnVucwxZs4ehGaEyuPBEHvVJywLp9DEK9l80dvrAlpxeciUBUO5vOVxuaTDESlT-8i9aYUc96sCy5SIKWFpzdd6E4B-eM1N9XWih0783mXolMiOq3FtEd_ub_RJFrVZLogQgOilWUm2o7zJAAZVq36uATNAkq0nbyUBrFFGa1NBu2TrhhP8CYw76jeJYbv_FIfrNnSFeTv6onxhxHlQPg_rn7nEGIgTVI97_QS0FEKSSyLn8vp3s3JNYCarTdVIZFL_txaDMm_tyZByxnDsSWFKJGWC48dMlKg3FNCRJnGwgFoF4NnSd7T9Qr-xWfRMkc1ZspppqEQiq-Vd1ZdyzA6zC4yJoJBwKY6h4yMsz2QIycF5E0aQ7txWnJKgEftG_GVc6n9mG93ECxr0jkpsrGCAPOfjVoGhgvDyHTFjJc8rJDXrgDaYxj0YmlG2ua5AZme4MoeEELw10PRDXmMj9sFyoUU4QoCxQYdL7Q9Qn1YGc763yc44HAY8GSB0mJ3OVTWue8VfVxn48uM2lDp1BQ6k2xtCJOREGCU1oE7YQ16uWB3CPHCkGVXgxtKu3BKjc-gPWJRw0jTkdAqSbtfULHTJC7OxbC5YjFA_Y-EDt71RW9WXByZ5f35eMPN1SJsHQLQORdcsAThWA685Q",
          caption: "What is your motivation for joining us?",
          label: "Motivation"
        },
        {
          type: "radio",
          src:
            "https://media.videoask.com/transcoded/3d6dcbc3-2651-402f-bb22-e236624e131e/video.mp4?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJtZWRpYV9pZCI6IjNkNmRjYmMzLTI2NTEtNDAyZi1iYjIyLWUyMzY2MjRlMTMxZSIsImV4cCI6MTY0NjA5MTExNX0.wYJGKv8J2JYKxO4k20dA3NMkmbAJvdwzsovhNjAq-hI0wdhADIe_uRmj2C_8bAMrEtryMtL7L5wIsI3pZmML1Zq4QXv1fn6JB0aXGUM5B7psCHwyk17U2n90hODUNhesFileU40CZUVzrWp6Ob0Dp1HFwgyjMB3T_f4_gNm8n2pEoZSsHrt5M4JFzMO5118-lVUthRC5CWl5FMBEJYpjSt-GL3FOGRt4xs3FkCIieejU0wWsmplVJ_5X0wFm3NARvKer0XOBnaQmAkTb0veo1edJz4l6dQTxAs0FT4xiFxUOeHcfVR2Q4T1LYNjoExinL9jFc_1lvuh6wNOQdFcw79vYEEnDE_78A3w7sr6T4Smh9oU7z6swdMgKATIOXHaWgWzgIDuwmUYuMGHlYIAlx9hvav5O05RZtEJS4HO2R21nnT-wbulcN-daaSpVjUlsP4HZZm-voZwwScqyYgv2DO83OgHfPn3mvs2ZoVQQnKhr_pWiRyGmuMmW9xtyAoF4vYl-v4DtBwgvvCMavfLm8k_UV7m03Qb9nl4esZzFlSgYBxQiXZP3swQHgaObvasqAJ2KYI49FFEAIapwMG4xjz-l7Lld1IrJAabmFYT6rzWI3XILtZqGnu1dfEx98VyhCVekL03P3LXkEbQHShB6BNz8UE-sWXjwAR889s7rvo0",
          caption: "What makes you think you'll be a good fit for us?",
          label: "GoodFit",
          options: ["I'm smart", "I'm not smart"]
        }
      ]
    };
  }

  handleToggleChatButtonClick() {
    this.isFormOpen = !this.isFormOpen;
    this.toggleChatButton.remove();
    this.createToggleChatButton();

    if (this.isFormOpen) {
      this.getFormData();
      this.createFormElement();
    } else {
      this.formContainer.remove();
    }
  }

  createToggleChatButton() {
    // chat open button
    const toggleChatButton = document.createElement("div");
    this.toggleChatButton = toggleChatButton;
    toggleChatButton.classList.add("artemis-widget-bottom-right-button");
    toggleChatButton.onclick = () => {
      this.handleToggleChatButtonClick();
    };

    // chat image in chat open button
    const toggleChatImage = document.createElement("img");
    toggleChatImage.src = this.isFormOpen
      ? "https://img.icons8.com/ios/50/000000/delete-sign--v1.png"
      : "https://img.icons8.com/ios/50/000000/chat--v1.png";
    toggleChatImage.classList.add("artemis-widget-bottom-right-image");
    toggleChatButton.appendChild(toggleChatImage);

    document.body.appendChild(toggleChatButton);
  }

  changeFormState(event) {
    const currentInput = { [event.target.name]: event.target.value };
    this.formState = { ...this.formState, ...currentInput };
  }

  renderQuestion(question) {
    const questionsContainer = document.createElement("div");
    questionsContainer.classList.add("artemis-widget-question-container");

    const videoElement = document.createElement("video");
    videoElement.src = question.src;
    videoElement.setAttribute("autoplay", " ");
    videoElement.classList.add("artemis-widget-video-element");
    questionsContainer.appendChild(videoElement);

    switch (question.type) {
      case "text":
        const textLabel = document.createElement("label");
        textLabel.setAttribute("for", question.label);
        textLabel.innerText = question.caption;
        questionsContainer.appendChild(textLabel);

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.name = question.label;
        textInput.onchange = (e) => {
          this.changeFormState(e);
        };
        questionsContainer.appendChild(textInput);
        break;

      case "radio":
        const radioText = document.createElement("p");
        radioText.innerText = question.caption;
        questionsContainer.appendChild(radioText);

        for (let radioOption of question.options) {
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

          questionsContainer.appendChild(radioLabel);
          questionsContainer.appendChild(radioInput);
        }
        break;

      default:
        break;
    }

    this.formElement.appendChild(questionsContainer);
    return questionsContainer;
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

  submitForm(event) {
    event.preventDefault();
    console.log(this.formState);
    this.formElement.remove();
    this.createThankYouElement();
  }

  createFormElement() {
    const formContainer = document.createElement("div");
    this.formContainer = formContainer;

    // form element
    const formElement = document.createElement("form");
    this.formElement = formElement;
    formElement.id = "artemis-widget-form";
    formElement.onsubmit = (e) => {
      this.submitForm(e);
    };
    formElement.classList.add("artemis-widget-form-container");
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

    document.body.appendChild(formContainer);
  }

  applyStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .artemis-widget-bottom-right-button {
        position: fixed;
        right: 1vw;
        bottom: 1vw;
        width: 5vw;
        height: 5vw;
        padding: 1rem;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 0 10px 0 rgb(219 219 219 / 75%), 0 2px 10px 0 rgb(173 158 158);
      }

      .artemis-widget-bottom-right-image {
        width: 90%;
      }

      .artemis-widget-card {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .hidden {
        display: none;
      }

      .artemis-widget-video-element {
        width: 300px;
      }
    `;
    document.head.appendChild(styleTag);
  }
}
