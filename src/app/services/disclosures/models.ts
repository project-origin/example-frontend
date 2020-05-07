import { Type } from 'class-transformer';


export class Disclosure {
    id: string;
    name: string;
    description: string;
    publicizeMeteringpoints: boolean;
    publicizeGsrn: boolean;
    publicizePhysicalAddress: boolean;

    @Type(() => Date)
    begin: Date;

    @Type(() => Date)
    end: Date;
}
