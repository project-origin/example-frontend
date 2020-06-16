import { Type } from 'class-transformer';


export class Account {
    id: String;
}


export class User {
    id: String;
    name: String;
    company: String;
    email: String;
    phone: String;
    hasPerformedOnboarding: boolean;

    @Type(() => Account)
    accounts: Account[] = [];
}
