import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import {
    BusinessError,
    BusinessLogicException,
} from '../shared/errors/bussiness-errors';

@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,

    ) { }

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        this.validateNombre(paciente.nombre);
        return await this.pacienteRepository.save(paciente);
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente = await this.pacienteRepository.findOne({
            where: { id },
            relations: ['diagnosticos', 'medico'],
        });
        if (!paciente) {
            throw new BusinessLogicException(
                'Paciente not found',
                BusinessError.NOT_FOUND,
            );
        }
        return paciente;
    }

    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteRepository.find({
            relations: ['diagnosticos', 'medico'],
        });
    }

    async delete(id: string): Promise<void> {
        const paciente = await this.pacienteRepository.findOne({
            where: { id },
            relations: ['diagnosticos', 'medico'],
        });

        if (!paciente) {
            throw new BusinessLogicException(
                'Paciente not found',
                BusinessError.NOT_FOUND,
            );
        }

        if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
            throw new BusinessLogicException(
                'No se puede eliminar un paciente con diagnósticos asociados.',
                BusinessError.PRECONDITION_FAILED,
            );
        }

        await this.pacienteRepository.remove(paciente);
    }

    private validateNombre(nombre: string): void {
        if (!nombre || nombre.length < 3) {
            throw new BusinessLogicException(
                'El nombre del paciente debe tener al menos 3 caracteres',
                BusinessError.PRECONDITION_FAILED,
            );
        }
    }
}
