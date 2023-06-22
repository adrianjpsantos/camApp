import { Injectable } from '@angular/core';
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js';
import { FaceClient } from '@azure/cognitiveservices-face';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private APIKEY = '1ca8212e16244cfa847c69ced926eaed';
  private ENDPOINT = 'https://camapp-vinicius.cognitiveservices.azure.com/';

  constructor() {}

  async descreverImagem(foto: Blob) {
    //FAZER LOGIN
    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      this.APIKEY
    );

    //CRIAR SERVIÇO
    const client = new ComputerVisionClient(
      cognitiveServiceCredentials,
      this.ENDPOINT
    );

    return await client
      .describeImageInStream(foto, { language: 'pt' })
      .then((retorno) => {
        console.log('Descrever Imagem: ', retorno);

        return {
          descricao: retorno.captions ? retorno.captions[0].text : '',
          confianca: retorno.captions ? retorno.captions[0].confidence : '',
          tags: retorno.tags ? retorno.tags : [],
          tipo: 'descrever',
        };
      });
  }

  async tagsImagem(foto: Blob) {
    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      this.APIKEY
    );
    const client = new ComputerVisionClient(
      cognitiveServiceCredentials,
      this.ENDPOINT
    );

    return await client
      .tagImageInStream(foto, { language: 'pt' })
      .then((retorno) => {
        console.log('Tags Imagem: ', retorno);

        let tags = retorno.tags ? retorno.tags : [];

        return {
          tags: typeof tags[0] === 'string' ? tags : tags.map((i) => i.name),
          tipo: 'tags',
        };
      });
  }

  async deteccaoFacial(foto: Blob) {
    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      this.APIKEY
    );
    const client = new FaceClient(cognitiveServiceCredentials, this.ENDPOINT);

    return await client.face
      .detectWithStream(foto, {
        detectionModel: 'detection_01',
        recognitionModel: 'recognition_04',
        returnFaceAttributes: [
          'age',
          'gender',
          'headPose',
          'smile',
          'facialHair',
          'glasses',
          'emotion',
          'hair',
          'makeup',
          'occlusion',
          'accessories',
          'blur',
          'exposure',
          'qualityForRecognition',
        ],
      })
      .then((retorno) => {
        console.log('Detecção de Face: ', retorno);

        return retorno.map((face) => ({
          atributos: face.faceAttributes,
          posicao: face.faceRectangle,
        }));
      });
  }
}
