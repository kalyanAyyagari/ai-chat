import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: WritableSignal<{ role: 'system' | 'user' | 'assistant', content: string | object }[]> = signal(
    [
      { role: 'assistant', content: 'how may I help you' },
    ]
  );
  userInput = signal('');
  models = [
    "gpt-4o-mini",
    "gpt-4o",
    "claude-3-5-sonnet",
    "deepseek-chat",
    "deepseek-reasoner",
    "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
    "mistral-large-latest",
    "codestral-latest",
    "google/gemma-2-27b-it",
    "grok-beta"
  ];
  selectedModel = this.models[0];
  options = {
    model: this.selectedModel,
    stream: true
  }
  async sendMessage() {
    const inputElement = document.getElementById('userInput');
    if (this.userInput().trim() && inputElement) {
      this.messages().push({ role: 'user', content: this.userInput() });
      inputElement.setAttribute("disabled", 'true');
      this.userInput.set('');

      const gen = await puter.ai.chat(this.messages(), this.options);
      let response = await gen.next();
      this.messages().push({ role: 'assistant', content: response?.value?.text });
      while (!response.done) {
        response = await gen.next();
        if (response?.value?.text) {
          const existing = this.messages()[this.messages().length - 1];
          this.messages()[this.messages().length - 1] = { ...existing, content: existing.content + response.value.text };
        }
      };

      inputElement.removeAttribute("disabled");
      inputElement.focus();
    }
  }

  updateModel() {
    this.options.model = this.selectedModel;
    this.resetMessages();
  }

  resetMessages() {
    this.messages.set([
      { role: 'assistant', content: 'how may I help you' },
    ]);
  }
}
