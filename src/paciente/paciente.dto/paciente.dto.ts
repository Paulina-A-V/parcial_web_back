/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class PacienteDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    genero: string;
}