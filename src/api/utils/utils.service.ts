import { Injectable } from '@nestjs/common';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { DataSource } from 'typeorm';
import fs from 'fs/promises';
import path from 'path';

@Injectable()
export class UtilsService {
  private readonly dir = 'content/games';

  constructor(private readonly dataSource: DataSource) {
    //
  }

  async clearDB() {
    try {
      await this.dataSource.dropDatabase();
      await this.dataSource.synchronize();

      const files = await fs.readdir(this.dir);
      await Promise.all(
        files
          .filter((file) => file !== '.gitkeep')
          .map((file) =>
            fs.rm(path.join(this.dir, file), {
              recursive: true,
              force: true,
            }),
          ),
      );

      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'UtilsService');
    }
  }
}
