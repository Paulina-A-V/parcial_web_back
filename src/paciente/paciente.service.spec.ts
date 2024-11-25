import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity/diagnostico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientes: PacienteEntity[];
  let diagnosticoRepository: Repository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity)
    );
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(
      getRepositoryToken(DiagnosticoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientes = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.lorem.word(),
        genero: faker.lorem.word(),
      });
      pacientes.push(paciente);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new paciente', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: faker.person.fullName(),
      genero: faker.person.gender(),
      diagnosticos: [],
      medico: [],
    };
    const result = await service.create(paciente);
    expect(result).toEqual(paciente);
  });

  it('should create an exception when creating a patient name with a name thats less then 3 letters ', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: 'Jo',
      genero: 'Masculino',
      diagnosticos: [],
      medico: [],
    };

    await expect(service.create(paciente)).rejects.toHaveProperty(
      'message',
      'El nombre del paciente debe tener al menos 3 caracteres',
    );
  });

  it('findOne should return a paciente by id', async () => {
    const storedPaciente: PacienteEntity = pacientes[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
  });

  it('findOne should throw an exception for an invalid paciente', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "Paciente not found"
    );
  });

  it('findAll should return all comments', async () => {
    const comments: PacienteEntity[] = await service.findAll();
    expect(comments).not.toBeNull();
    expect(comments).toHaveLength(pacientes.length);
  });

  it('delete should remove a paciente', async () => {
    const storedPaciente: PacienteEntity = pacientes[0];
    await service.delete(storedPaciente.id);
    const result = await service.findAll();
    expect(result).not.toContain(storedPaciente);
  });

  it('delete should throw an exception for an invalid paciente', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "Paciente not found"
    );
  });

  it('delete should throw an exception for a paciente with diagnosticos', async () => {
    const storedPaciente: PacienteEntity = pacientes[0];
    const paciente = await service.findOne(storedPaciente.id);
    const diagnostico = await diagnosticoRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      pacientes: [],
    });
    paciente.diagnosticos = [diagnostico];
    await repository.save(paciente);

    await expect(service.delete(storedPaciente.id)).rejects.toHaveProperty(
      'message',
      'No se puede eliminar un paciente con diagnósticos asociados.',
    );
  });
});
