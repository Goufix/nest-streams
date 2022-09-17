import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as Parser from 'jsonparse';
import { lastValueFrom } from 'rxjs';
console.log('Parser', new Parser());

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
            console.log('value', value);
            res.write(JSON.stringify(value) + ',');
          }
        } catch {}
      };
      obs.data.on('end', () => {
        console.log('a');
        setTimeout(() => {
          console.log('b');
          res.write(']');
          res.end();
        }, 3000);
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
