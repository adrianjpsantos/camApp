import { FotoService } from './../services/foto.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public fotoService: FotoService) {}

  tirarFoto() {
    this.fotoService.tirarFoto();
  }
}
