/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let listaMedicos: MedicoEntity[] = [];
  let listaPacientes: PacienteEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    medicoRepository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();

    listaMedicos = [];
    for (let i = 1; i < 6; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.lorem.word(),
        especialidad: faker.lorem.word(),
        telefono: faker.lorem.word(),
      });
      listaMedicos.push(medico);
    }

    listaPacientes = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await pacienteRepository.save({
        nombre: faker.lorem.word(),
        genero: 'Femenino',
        medicos: [],
        diagnosticos: []
      });
      listaPacientes.push(paciente);
    }


  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a medico to a paciente', async () => {
    const paciente2: PacienteEntity = await pacienteRepository.save({
      nombre: faker.lorem.word(),
      genero: 'Femenino',
    });
    const medico2: MedicoEntity = await medicoRepository.save({
      nombre: faker.lorem.word(),
      especialidad: faker.lorem.word(),
      telefono: faker.lorem.word(),
    });

    const result = await service.addMedicoToPaciente(
      paciente2.id,
      medico2.id,
    );

    expect(result).not.toBeNull();
    expect(result.medico.length).toBe(1);
    expect(result.medico[0].nombre).toBe(medico2.nombre);
    expect(result.medico[0].especialidad).toBe(medico2.especialidad);
    expect(result.medico[0].telefono).toBe(medico2.telefono);
  });

  it('addMedicoToPaciente should throw an exception when the paciente already has 5 medicos', async () => {
    if (listaMedicos.length < 5) {
      throw new Error('No hay suficientes medicos en la lista');
    }
  });

  it('addMedicoToPaciente should throw an error when the paciente does not exist', async () => {
    await expect(service.addMedicoToPaciente("0", listaMedicos[0].id)).rejects.toHaveProperty('message', 'Paciente no encontrado.');
  });

  it('addMedicoToPaciente should throw an error when the medico does not exist', async () => {
    await expect(service.addMedicoToPaciente(listaPacientes[0].id, "0")).rejects.toHaveProperty('message', 'Medico no encontrado.');
  });

});
