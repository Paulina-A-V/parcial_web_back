/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let medicos: MedicoEntity[];
  let pacienteRepository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity)
    );
    pacienteRepository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    medicos = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await repository.save({
        nombre: faker.lorem.word(),
        especialidad: faker.lorem.word(),
        telefono: faker.lorem.words(),
      });
      medicos.push(medico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new medico', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.lorem.words(),
      pacientes: [],
    };
    const result = await service.create(medico);
    expect(result).toEqual(medico);
  });

  it('it should create an exception when creating a medico with an empty nombre o especialidad', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: '',
      especialidad: '',
      telefono: faker.lorem.words(),
      pacientes: [],
    };
    try {
      await service.create(medico);
    } catch (e) {
      expect(e.message).toEqual('El nombre y la especialidad son requeridos');
    }
  }
  );

  it('findOne should return a medico by id', async () => {
    const storedMedico: MedicoEntity = medicos[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.nombre).toEqual(storedMedico.nombre);
    expect(medico.especialidad).toEqual(storedMedico.especialidad);
    expect(medico.telefono).toEqual(storedMedico.telefono);
  });

  it('findOne should throw an exception for an invalid medico', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "Medico not found"
    );
  });

  it('findAll should return all medicos', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos.length).toEqual(5);
  }
  );

  it('update should return a medico by id', async () => {
    const storedMedico: MedicoEntity = medicos[0];
    const medico: MedicoEntity = {
      id: storedMedico.id,
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.lorem.words(),
      pacientes: [],
    };
    const updatedMedico: MedicoEntity = await service.update(storedMedico.id, medico);
    expect(updatedMedico).not.toBeNull();
    expect(updatedMedico.nombre).toEqual(medico.nombre);
    expect(updatedMedico.especialidad).toEqual(medico.especialidad);
    expect(updatedMedico.telefono).toEqual(medico.telefono);
  });

  it('update should throw an exception for an invalid medico', async () => {
    const medico: MedicoEntity = {
      id: '0',
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.lorem.words(),
      pacientes: [],
    };
    await expect(() => service.update("0", medico)).rejects.toHaveProperty(
      "message",
      "Medico not found"
    );
  });

  it('delete should remove a medico', async () => {
    const storedPaciente: MedicoEntity = medicos[0];
    await service.delete(storedPaciente.id);
    const result = await service.findAll();
    expect(result).not.toContain(storedPaciente);
  });

  it('delete should throw an exception for an invalid medico', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "Medico not found"
    );
  });

  it('delete should throw an exception for a medico with pacientes', async () => {
    const storedMedico: MedicoEntity = medicos[0];
    const medico = await service.findOne(storedMedico.id);
    const paciente = await pacienteRepository.save({
      nombre: faker.lorem.word(),
      genero: faker.lorem.word(),
      diagnosticos: [],
      medico: [],
    });
    medico.pacientes = [paciente];
    await repository.save(medico);

    await expect(service.delete(storedMedico.id)).rejects.toHaveProperty(
      'message',
      'No se puede eliminar un médico que tiene al menos un paciente asociado',
    );
  });
});
