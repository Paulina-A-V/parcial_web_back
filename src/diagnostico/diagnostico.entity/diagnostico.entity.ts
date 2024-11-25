/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { PacienteEntity } from '../../paciente/paciente.entity/paciente.entity';

@Entity()
export class DiagnosticoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => PacienteEntity, (paciente) => paciente.diagnosticos)
    @JoinTable()
    pacientes: PacienteEntity[];

}
