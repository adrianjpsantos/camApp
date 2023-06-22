import { Component, Input, OnInit } from '@angular/core';
import { FaceAttributes, FaceRectangle } from '@azure/cognitiveservices-face/esm/models';



@Component({
  selector: 'app-face-modal',
  templateUrl: './face-modal.page.html',
  styleUrls: ['./face-modal.page.scss'],
})
export class FaceModalPage implements OnInit {

  @Input() atributos: FaceAttributes = {};
  @Input() posicao: FaceRectangle = {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  };

  constructor() { }

  ngOnInit() {
  }

}
