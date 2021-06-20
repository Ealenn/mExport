import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Email } from './Email';

@Entity()
export class MailServer
{
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public user: string;

    @Column()
    public password: string;

    @Column()
    public server: string;

    @Column()
    public port: number;

    @Column()
    public secure: boolean;

    @OneToMany(() => Email, email => email.server)
    emails: Email[];
}
