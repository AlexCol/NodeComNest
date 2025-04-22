import { Controller, Get, Post, UseInterceptors, UploadedFile, Res, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';

@Controller('files')
export class FilesController {
  constructor() { }

  @Get()
  findAll() {
    return 'This action returns all files';
  }

  @Post('data')
  @UseInterceptors(FileInterceptor('file')) // Intercepta o arquivo enviado no campo 'file'
  async Upload(
    @UploadedFile() file: Express.Multer.File
  ) {
    const mimetype = file.mimetype;
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1); // Obtém a extensão do arquivo sem o ponto inicial

    /*
      usar tecnicas para evitar que se gere mesmo nome ao salvar um arquivo
      uma forma é usar o timestamp, mas existem outras formas
      como usar um UUID ou um hash do arquivo
     */
    const fileName = Date.now() + '.' + fileExtension; // Nome do arquivo com timestamp
    const filePath = path.resolve(process.cwd(), 'uploads', fileName); // Caminho completo do arquivo

    await fs.writeFile(filePath, file.buffer); // Salva o arquivo no sistema de arquivos

    return {
      fieldname: file.fieldname, // Nome do campo do arquivo
      originalName: file.originalname, // Nome original do arquivo
      mimetype: file.mimetype, // Tipo MIME do arquivo
      buffer: {}, // Buffer do arquivo
      size: file.size, // Tamanho do arquivo
    }
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file')) // Intercepta o arquivo enviado no campo 'file'
  Upload2(
    @UploadedFile() file: Express.Multer.File, // Recebe o arquivo enviado
    @Res() res: Response,
  ) {
    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `inline; filename="${file.originalname}"`
    });
    return res.send(file.buffer)
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('file')) // Intercepta o arquivo enviado no campo 'file'
  async Uploads(
    @UploadedFiles() files: Array<Express.Multer.File>, // Recebe o arquivo enviado
    @Res() res: Response,
  ) {
    files.forEach(async (file) => {
      const fileExtension = path.extname(file.originalname).toLowerCase(); // Obtém a extensão do arquivo sem o ponto inicial
      const fileName = crypto.randomUUID() + fileExtension; // Nome do arquivo com guui, nesse caso usar timestamp pode ser ruim, se as imagens forem salvas muito rapido (pode gerar duplicidade)
      const filePath = path.resolve(process.cwd(), 'uploads', fileName); // Caminho completo do arquivo
      await fs.writeFile(filePath, file.buffer); // Salva o arquivo no sistema de arquivos
    });

    return res.send({ message: 'ok' }); // Retorna a resposta
  }
}
