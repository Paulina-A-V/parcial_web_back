/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class MedicoDto {
    @IsString()
    nombre: string;

    @IsString()
    especialidad: string;

    @IsNotEmpty()
    @IsString()
    telefono: string;
}