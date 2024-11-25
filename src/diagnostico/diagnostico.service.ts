import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import {
    BusinessError,
    BusinessLogicException,
} from '../shared/errors/bussiness-errors';
@Injectable()
export class DiagnosticoService {
    constructor(
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
    ) { }

    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoRepository.find({
            relations: ['pacientes'],
        });
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({
            where: { id },
            relations: ['pacientes'],
        });
        if (!diagnostico) {
            throw new BusinessLogicException(
                'Diagnostico not found',
                BusinessError.NOT_FOUND,
            );
        }
        return diagnostico;
    }

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        this.validateDescripcionLength(diagnostico.descripcion);
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async update(id: string, diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        const persistedDiagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({
            where: { id },
        });
        if (!persistedDiagnostico) {
            throw new BusinessLogicException(
                'Diagnostico not found',
                BusinessError.NOT_FOUND,
            );
        }
        this.validateDescripcionLength(diagnostico.descripcion);
        diagnostico.id = id;
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async delete(id: string): Promise<void> {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({
            where: { id },
        });
        if (!diagnostico) {
            throw new BusinessLogicException(
                'Diagnostico not found',
                BusinessError.NOT_FOUND,
            );
        }
        await this.diagnosticoRepository.remove(diagnostico);
    }

    private validateDescripcionLength(descripcion: string): void {
        if (descripcion && descripcion.length > 200) {
            throw new BusinessLogicException(
                'La descripción no puede exceder los 200 caracteres.',
                BusinessError.PRECONDITION_FAILED,
            );
        }
    }
}
