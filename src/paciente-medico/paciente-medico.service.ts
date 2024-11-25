import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import {
    BusinessError,
    BusinessLogicException,
} from '../shared/errors/bussiness-errors';

@Injectable()
export class PacienteMedicoService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) { }


    async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
        const paciente = await this.pacienteRepository.findOne({
            where: { id: pacienteId },
            relations: ['medico', 'diagnosticos'],
        });
        if (!paciente) throw new BusinessLogicException('Paciente no encontrado.', BusinessError.NOT_FOUND);

        const medico = await this.medicoRepository.findOne({
            where: { id: medicoId }
        });
        if (!medico) throw new BusinessLogicException('Medico no encontrado.', BusinessError.NOT_FOUND);

        if (paciente.medico.length >= 5) {
            throw new BusinessLogicException('Un paciente no puede tener más de cinco medicos asociados.', BusinessError.PRECONDITION_FAILED);
        }

        paciente.medico.push(medico);
        return this.pacienteRepository.save(paciente);
    }
}