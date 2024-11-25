import { Module } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticoEntity])],
  providers: [DiagnosticoService]
})
export class DiagnosticoModule { }
