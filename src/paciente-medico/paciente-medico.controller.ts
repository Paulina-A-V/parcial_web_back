/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { Post, Param, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PacienteMedicoService } from './paciente-medico.service';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
    constructor(private readonly pacienteMedicoService: PacienteMedicoService) { }

    @Post(':pacienteId/medicos/:medicoId')
    async addMedicoToPaciente(
        @Param('medicoId') medicoId: string,
        @Param('pacienteId') pacienteId: string
    ) {
        return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    }
}