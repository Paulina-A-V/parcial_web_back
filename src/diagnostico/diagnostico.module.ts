/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { DiagnosticoController } from './diagnostico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticoEntity])],
  providers: [DiagnosticoService],
  controllers: [DiagnosticoController]
})
export class DiagnosticoModule { }
