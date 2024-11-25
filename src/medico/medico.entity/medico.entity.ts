/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { PacienteEntity } from '../../paciente/paciente.entity/paciente.entity';

@Entity()
export class MedicoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    especialidad: string;

    @Column()
    telefono: string;

    @ManyToMany(() => PacienteEntity, (paciente) => paciente.medico)
    pacientes: PacienteEntity[];

}

