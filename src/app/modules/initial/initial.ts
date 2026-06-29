import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'initial-screen',
  templateUrl: 'initial.html',
  styleUrls: ['initial.scss'],
})

export class InitialScreen {
  ghostCards = Array.from({ length: 10 }, (_, i) => ({
    left: `${(i % 5) * 68 + 16}px`,
    top:  i < 5 ? `${200 + Math.sin(i) * 18}px` : `${295 + Math.cos(i) * 14}px`,
    opacity: 0.12 + (i % 3) * 0.04,
  }));
}
