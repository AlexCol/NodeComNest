import { Pessoa } from "src/pessoas/entities/pessoa.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity() //se não passar nada, o nome da tabela será o nome da classe
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  texto: string;

  //muitos recados podem ser enviados por uma pessoa
  @ManyToOne(() => Pessoa)
  @JoinColumn({ name: 'de' })
  de: Pessoa;

  //muitos recados podem ser enviados para uma pessoa
  @ManyToOne(() => Pessoa)
  @JoinColumn({ name: 'para' })
  para: Pessoa;

  @Column({ default: false })
  lido: boolean;

  @Column()
  criadoEm: Date;

  @CreateDateColumn() //cria uma coluna que é automaticamente preenchida na criação do registro
  createdAt?: Date;

  @UpdateDateColumn() //cria uma coluna que é automaticamente preenchida na atualização do registro
  updatedAt?: Date;
}
