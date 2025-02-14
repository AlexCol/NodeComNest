import { IsEmail } from "class-validator";
import { Recado } from "src/recados/entities/recado.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  nome: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  //esses campos são preenchidos automaticamente pelo TypeORM e não são registrados no banco
  @OneToMany(() => Recado, recado => recado.de)
  recadosEnviados: Recado[];

  //esses campos são preenchidos automaticamente pelo TypeORM e não são registrados no banco
  @OneToMany(() => Recado, recado => recado.para)
  recadosRecebidos: Recado[];
}
