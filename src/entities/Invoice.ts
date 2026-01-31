import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { InvoiceStatus } from "@/lib/enums";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING
  })
  status: InvoiceStatus;

  @Column({ type: "date" })
  due_date: string;

  @Column({ nullable: true })
  nfe_url: string; // Nota Fiscal (Upload do Admin)

  @Column({ nullable: true })
  receipt_url: string; // Comprovante (Upload do Cliente) <--- NOVO CAMPO

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}