import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Pessoa {
  @PrimaryColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  nome: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
