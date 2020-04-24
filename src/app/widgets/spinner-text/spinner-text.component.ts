import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-text',
  templateUrl: './spinner-text.component.html',
  styleUrls: ['./spinner-text.component.css']
})
export class SpinnerTextComponent {

  @Input() text: string;
  @Input() diameter: number = 32;

  constructor() { }

}
