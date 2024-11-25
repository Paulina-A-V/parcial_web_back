import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticos: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(
      getRepositoryToken(DiagnosticoEntity)
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticos = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
      });
      diagnosticos.push(diagnostico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      pacientes: []
    };
    const result = await service.create(diagnostico);
    expect(result).toEqual(diagnostico);
  });

  it('should create an exception when creating a diagnostic with more than 200 letters', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: 'ab',
      descripcion: 'En un pueblito no muy lejano, vivía una mamá cerdita junto con sus tres cerditos. Todos eran muy felices hasta que un día la mamá cerdita les dijo:Hijitos, ustedes ya han crecido, es tiempo de que sean cerditos adultos y vivan por sí mismos. Antes de dejarlos ir, les dijo: En el mundo nada llega fácil, por lo tanto, deben aprender a trabajar para lograr sus sueños. Mamá cerdita se despidió con un besito en la mejilla y los tres cerditos se fueron a vivir en el mundo. El cerdito menor, que era muy, pero muy perezoso, no prestó atención a las palabras de mamá cerdita y decidió construir una casita de paja para terminar temprano y acostarse a descansar.',
      pacientes: []
    };
    try {
      await service.create(diagnostico);
    } catch (error) {
      expect(error.message).toEqual('La descripción no puede exceder los 200 caracteres.');
    }
  });

  it('findOne should return a diagnostico by id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticos[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(storedDiagnostico.id);
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
  });

  it('findOne should throw an exception for an invalid diagnostico', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "Diagnostico not found"
    );
  });

  it('findAll should return all comments', async () => {
    const comments: DiagnosticoEntity[] = await service.findAll();
    expect(comments).not.toBeNull();
    expect(comments).toHaveLength(diagnosticos.length);
  });

  it('delete should remove a diagnostico', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticos[0];
    await service.delete(storedDiagnostico.id);
    const result = await service.findAll();
    expect(result).not.toContain(storedDiagnostico);
  });

  it('delete should throw an exception for an invalid diagnostico', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "Diagnostico not found"
    );
  });
});
