import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {

  @Input() title : string = "";
  @Input() content : string = "";
  @Output() confirm = new EventEmitter<boolean>();

  confirmDelete(confirm : boolean){
    this.confirm.emit(confirm); // Activate Event
  }
}
