import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as Parser from 'jsonparse';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(private http: HttpService) {}
  async getHello(res) {
    try {
      const obs = await lastValueFrom(
        this.http.get('', {
          responseType: 'stream',
        }),
      );

      const parser = new Parser();

      obs.data.on('data', (chunk) => {
        parser.write(chunk);
      });

      res.write('[');
      parser.onValue = (value) => {
        try {
          if (value?.admins) {
            res.write(JSON.stringify(value) + ',');
          }
        } catch {}
      };

      obs.data.on('end', () => {
        res.write(']');
        res.end();
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
