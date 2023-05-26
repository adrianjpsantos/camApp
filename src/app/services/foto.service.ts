import { Foto } from './../models/Foto.interface';
import { Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  //Cria a lista de fotos que vão estar armazenadas no dispositivo
  fotos: Foto[] = [];

  //cria a variavel que armazena o local fisico (pasta) de armazenamento das fotos
  private FOTO_ARMAZENAMENTO : string = 'fotos';

  constructor() { }

  async tirarFoto(){
    //Chama função de camera e armazena o arquivo na constante
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri,//Dados baseados em arquivos / oferece melhor desempenho
      source: CameraSource.Camera,//Tira automaticmente uma nova foto com a camera
      quality: 100,//qualidade da imagem tirada, vai de 0 a 100
    })
  }

}
