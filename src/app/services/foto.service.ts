import { Foto } from './../models/Foto.interface';
import { Injectable } from '@angular/core';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  //Cria a lista de fotos que vão estar armazenadas no dispositivo
  fotos: Foto[] = [];

  //cria a variavel que armazena o local fisico (pasta) de armazenamento das fotos
  private FOTO_ARMAZENAMENTO: string = 'fotos';

  constructor(private platform: Platform) {}

  public async carregarFotosSalvas() {
    //Recuperar as fotos em cache
    const listaFotos = await Preferences.get({ key: this.FOTO_ARMAZENAMENTO });
    this.fotos = JSON.parse(listaFotos.value as string) || [];

    //se nao estiver rodando no navegador
    if (!this.platform.is('hybrid')) {
      //Exibir a foto lando-a no formato base64
      for (let foto of this.fotos) {
        //ler os dados de cada foto salva no sistema de arquivos
        const readFile = await Filesystem.readFile({
          path: foto.filepath,
          directory: Directory.Data,
        });

        //somente na plataforma da web: Carregar a foto com dados base64
        foto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async tirarFoto() {
    //Chama função de camera e armazena o arquivo na constante
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri, //Dados baseados em arquivos / oferece melhor desempenho
      source: CameraSource.Camera, //Tira automaticmente uma nova foto com a camera
      quality: 50, //Trocar para 50 para não precisar fazer compactação da imagem
    });

    const salvarArquivoFoto = await this.salvarFoto(fotoCapturada);

    // Adicionar nova foto á matriz Fotos
    this.fotos.unshift(salvarArquivoFoto);

    // Armazenar em cache todos os dados da foto para recuperação futura
    Preferences.set({
      key: this.FOTO_ARMAZENAMENTO,
      value: JSON.stringify(this.fotos),
    });
  }

  //Salva imagem em um arquivo no dispositivo
  public async salvarFoto(foto: Photo) {
    // Converta a foto para formato base64,exigido pela Api do sistema de arquivos para salvar
    const base64Data = await this.readAsBase64(foto);

    //Gravar o arquivo no diretório de dados
    const nomeArquivo = new Date().getTime() + '.jpeg';
    const arquivoSalvo = await Filesystem.writeFile({
      path: nomeArquivo,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      //Exiba a nova imagem reescrevendo o caminho 'file://' para HTTP
      // Detalhes: site do ionic ( file Protocol )
      return {
        filepath: arquivoSalvo.uri,
        webviewPath: Capacitor.convertFileSrc(arquivoSalvo.uri),
      };
    }else{
      // Use o webpath para exibir a nova imagem em vez da base64, pos ela ja esta carregada na memória
      return{
        filepath: nomeArquivo,
        webviewPath: foto.webPath,
      };
    }
  }

  // Leia a foto da camera no formato base64 com base na plataforma em que o aplicativo esta sendo executado
  private async readAsBase64(foto: Photo) {
    //"hibrido" detectara Cordova ou Capacitor
    if (this.platform.is('hybrid')) {
      // ler o arquivo no formato base64
      const arquivo = await Filesystem.readFile({
        path: foto.path as string,
      });

      return arquivo.data;
    } else {
      // Obtenha a foto, leia-a como um blob e, em seguida, converta-a para o formato base64
      const resposta = await fetch(foto.webPath!);
      const blob = await resposta.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  //Excluir a imagem, removendo-o dos dados de referencia e do sistema de arquivos
  public async deletePicture(foto: Foto, posicao: number) {
    // remover esse foto da matriz de dados de referencia Fotos
    this.fotos.splice(posicao, 1);

    //atualizar o cache de matriz de fotos sobrescrevendo a matriz de fotos existente
    Preferences.set({
      key: this.FOTO_ARMAZENAMENTO,
      value: JSON.stringify(this.fotos),
    });

    //ecluir o arquivo de foto do sistema de arquivos
    const nomeArquivo = foto.filepath.substr(foto.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: nomeArquivo,
      directory: Directory.Data,
    });
  }

  convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
