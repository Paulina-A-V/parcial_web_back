/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { MedicoDto } from './medico.dto/medico.dto';
import { MedicoEntity } from './medico.entity/medico.entity';
import { MedicoService } from './medico.service';


@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) { }

    @Get()
    async findAll() {
        return this.medicoService.findAll();
    }

    @Get(':medicoId')
    async findOne(@Param('medicoId') medicoId: string) {
        return this.medicoService.findOne(medicoId);
    }

    @Post()
    async create(@Body() medicoDto: MedicoDto) {
        const medico = plainToInstance(MedicoEntity, medicoDto);
        return this.medicoService.create(medico);
    }

    @Delete(':medicoId')
    @HttpCode(204)
    async delete(@Param('medicoId') medicoId: string) {
        return this.medicoService.delete(medicoId);
    }
}

