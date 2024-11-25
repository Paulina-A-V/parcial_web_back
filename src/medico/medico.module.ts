/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { MedicoController } from './medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity])],
  providers: [MedicoService],
  controllers: [MedicoController]
})
export class MedicoModule { }
