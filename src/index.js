import { ArtemisWidget } from './widget';

const script = document.getElementById("artemis-widget-script");

const userId = script.getAttribute("data-user");
const chatbotId = script.getAttribute("data-chatbot");
const tagline = script.getAttribute("data-tagline");

new ArtemisWidget(userId, chatbotId, tagline);
