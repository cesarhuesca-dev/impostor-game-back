import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import sharp from 'sharp';
import fs, { existsSync } from 'fs';

@Injectable()
export class FilesService {
  
  private readonly pathContentPlayersImage: string = 'content/games'
  private readonly allowedImageExtensions: string[] = ['png', 'jpg', 'jpeg', 'webp'];

  getImage(idGame: string, idPlayer: string){
    try {
      const i18n = I18nContext.current<I18nTranslations>();
      const path = join(`${__dirname}/../../../${this.pathContentPlayersImage}/${idGame}/${idPlayer}.webp`)

      if(!existsSync(path)){
        throw new BadRequestException(i18n?.t('validation.fileValidation'));
      }

      return path;

    } catch (error) {
      return false;
    }
  }
  
  async savePlayerImage(idGame: string, idPlayer: string, mimetype: string, buffer: Buffer<ArrayBufferLike> ): Promise<boolean> {
    try {
      const i18n = I18nContext.current<I18nTranslations>();
      
      if (!idGame || !idPlayer || !buffer) {
        throw new BadRequestException(i18n?.t('validation.fileValidation'));
      }

      if (!mimetype.startsWith('image/')) {
        throw new BadRequestException(i18n?.t('validation.fileValidation'));
      }

      const ext = mimetype.trim().split('/')[1];

      if (!this.allowedImageExtensions.includes(ext)) {
        throw new BadRequestException(i18n?.t('validation.fileValidation'));
      }

      const fileName: string = `${idPlayer}.webp`;
      const path = join(`./${this.pathContentPlayersImage}/${idGame}`)
      const filePath: string = join(path, fileName);
      //Convierte el archivo a webp
      const webpBuffer: Buffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      
      // Crear directorio si no existe
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }

      // Guardar archivo
      await fs.promises.writeFile(filePath, webpBuffer);

      return true;
    } catch (error) {
      return false;
    }
  }

  

}


