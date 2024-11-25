/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { MedicoEntity } from '../../medico/medico.entity/medico.entity';
import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity/diagnostico.entity';

@Entity()
export class PacienteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    genero: string;

    @ManyToMany(() => MedicoEntity, (medico) => medico.pacientes)
    @JoinTable()
    medico: MedicoEntity[];

    @ManyToMany(() => DiagnosticoEntity, (diagnostico) => diagnostico.pacientes)
    @JoinTable()
    diagnosticos: DiagnosticoEntity[];
}