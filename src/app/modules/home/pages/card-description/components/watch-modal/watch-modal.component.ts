import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'watch-modal',
  templateUrl: './watch-modal.component.html',
  styleUrls: ['./watch-modal.component.scss'],
})
export class WhereToWatchModalComponent implements OnInit {
  @Input() providers!: any;
  @Input() movieName!: string;
  @Output() close = new EventEmitter<void>();
  isEmpty!: boolean;

  ngOnInit(): void {
    if(this.providers === undefined){
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
