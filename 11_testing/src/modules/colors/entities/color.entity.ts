import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number; // Primary key, auto-incremented

  @Column({ length: 100 })
  colorName: string;

  @Column({ length: 100 })
  colorHex: string; // Hexadecimal representation of the color

  @Column({ length: 100 })
  colorRgb: string; // RGB representation of the color

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
