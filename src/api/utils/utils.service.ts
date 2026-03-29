import { Inject, Injectable } from '@nestjs/common';
import { ExceptionBuilder } from 'src/core/utils/exception';
import { Connection, DataSource, getConnection } from 'typeorm';

@Injectable()
export class UtilsService {
  
  constructor(private readonly dataSource: DataSource){
    //
  }

  async clearDB() {

    try {
      await this.dataSource.dropDatabase()
      await this.dataSource.synchronize();
      return true;
    } catch (error) {
      ExceptionBuilder.handleException(error, 'UtilsService'); 
    }
  }
  
}
