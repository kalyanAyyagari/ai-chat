import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: WritableSignal<{ role: 'system' | 'user' | 'assistant', content: string|object }[]> = signal(
    [
      { role: 'assistant', content: 'how may I help you' },
    ]
  );
  userInput = signal('');

  async sendMessage() {
    const inputElement = document.getElementById('userInput');
    if (this.userInput().trim() && inputElement) {
      this.messages().push({ role: 'user', content: this.userInput() });
      console.log('inputElement', inputElement);
      inputElement.setAttribute("disabled", 'true');
      this.userInput.set('');
      const response = await puter.ai.chat(this.messages());
      inputElement.removeAttribute("disabled");
      inputElement.focus();
      this.messages().push({ role: 'assistant', content: response?.message?.content|| "I'm not sure how to respond to that." });
      this.messages.set(this.messages());
    }
  }
}
