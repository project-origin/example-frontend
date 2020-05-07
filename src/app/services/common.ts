import { Transform } from "class-transformer";
import * as moment from 'moment';


export class DateRange {
  
    @Transform(obj => moment(obj).format('YYYY-MM-DD'), { toPlainOnly: true })
    begin: Date;
    
    @Transform(obj => moment(obj).format('YYYY-MM-DD'), { toPlainOnly: true })
    end: Date;

    constructor(args?: {
        begin: Date,
        end: Date,
    }) {
      Object.assign(this, args);
    }

}
