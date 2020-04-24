import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.css']
})
export class LoadingButtonComponent {

  @Input() text: string;
  @Input() loadingText: string;
  @Input() loading: boolean;
  @Input() color: string;
  @Input() type: string = 'button';


  get buttonText(): string {
    return this.loading ? this.loadingText : this.text;
  }


  constructor() { }


}
