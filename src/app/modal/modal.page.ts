import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  // Dados que vieram por parâmetro do componentProps
  @Input() descricao: string = '';
  @Input() confianca: number = 0;
  @Input() tags: any[] = [];
  @Input() tipo: string = '';

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  getTags(){
    if(this.tags instanceof String){
      return
    }
  }
  getConfianca(){
      return (parseFloat(this.confianca.toFixed(2))* 100).toString() + "%";
  }

}
