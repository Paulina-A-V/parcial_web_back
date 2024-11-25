/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { Get, Post, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './paciente.dto/paciente.dto';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { plainToInstance } from 'class-transformer';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) { }

    @Get()
    async findAll() {
        return this.pacienteService.findAll();
    }

    @Get(':pacienteId')
    async findOne(@Param('pacienteId') pacienteId: string) {
        return this.pacienteService.findOne(pacienteId);
    }

    @Post()
    async create(@Body() pacienteDto: PacienteDto) {
        const paciente = plainToInstance(PacienteEntity, pacienteDto);
        return this.pacienteService.create(paciente);
    }

    @Delete(':pacienteId')
    @HttpCode(204)
    async delete(@Param('pacienteId') pacienteId: string) {
        return this.pacienteService.delete(pacienteId);
    }
}