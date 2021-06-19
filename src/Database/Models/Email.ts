import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { MailServer } from "./MailServer";

@Entity()
export class Email {
    @PrimaryGeneratedColumn()
    public id?: number;
    @ManyToOne(() => MailServer, mailServer => mailServer.emails)
    public server: MailServer
    @Column()
    public from: string
    @Column()
    public to: string
    @Column()
    public subject: string
    @Column()
    public html: string
    @Column()
    public text: string
}
