import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity("users") // Nome da tabela no banco
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password_hash: string

  @Column({ nullable: true })
  consultorio: string

  @Column({ nullable: true })
  endereco: string

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @Column({ type: 'varchar', nullable: true })
  reset_token: string | null

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expiry: Date | null

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}