import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity() //se não passar nada, o nome da tabela será o nome da classe
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  texto: string;

  @Column({ type: 'varchar', length: 50 })
  de: string;

  @Column({ type: 'varchar', length: 50 })
  para: string;

  @Column({default: false})
  lido: boolean;

  @Column()
  criadoEm: Date;

  @CreateDateColumn() //cria uma coluna que é automaticamente preenchida na criação do registro
  createdAt?: Date;

  @UpdateDateColumn() //cria uma coluna que é automaticamente preenchida na atualização do registro
  updatedAt?: Date;
}
