/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import {
    BusinessError,
    BusinessLogicException,
} from '../shared/errors/bussiness-errors';

@Injectable()
export class MedicoService {

    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) { }



    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find(
            {
                relations: ['pacientes'],
            },
        );
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({
            where: { id },
            relations: ['pacientes'],
        });
        if (!medico) {
            throw new BusinessLogicException(
                'Medico not found',
                BusinessError.NOT_FOUND,
            );
        }
        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {

        if (!medico.nombre || medico.nombre.trim() === '') {
            throw new BusinessLogicException(
                'El nombre y la especialidad son requeridos',
                BusinessError.PRECONDITION_FAILED,
            );
        }
        if (!medico.especialidad || medico.especialidad.trim() === '') {
            throw new BusinessLogicException(
                'El nombre y la especialidad son requeridos',
                BusinessError.PRECONDITION_FAILED,
            );
        }
        return await this.medicoRepository.save(medico);
    }

    async update(id: string, medico: MedicoEntity): Promise<MedicoEntity> {
        const persistedMedico: MedicoEntity = await this.medicoRepository.findOne({
            where: { id },
        });
        if (!persistedMedico) {
            throw new BusinessLogicException(
                'Medico not found',
                BusinessError.NOT_FOUND,
            );
        }
        medico.id = id;
        return await this.medicoRepository.save(medico);
    }

    async delete(id: string): Promise<void> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({
            where: { id },
            relations: ['pacientes'],
        });

        if (!medico) {
            throw new BusinessLogicException(
                'Medico not found',
                BusinessError.NOT_FOUND,
            );
        }

        if (medico.pacientes && medico.pacientes.length > 0) {
            throw new BusinessLogicException(
                'No se puede eliminar un médico que tiene al menos un paciente asociado',
                BusinessError.PRECONDITION_FAILED,
            );
        }

        await this.medicoRepository.remove(medico);
    }
}
