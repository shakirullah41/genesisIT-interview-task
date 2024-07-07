import { DataSource } from 'typeorm';
export const clearDatabase = async (
  appDataSource: DataSource,
  toTruncate: String[]
): Promise<void> => {
  const entities = appDataSource.entityMetadatas;
  for await (const entity of entities) {
    if (toTruncate.includes(entity.name)) {
      const repository = appDataSource.getRepository(entity.name);
      await repository.query(
        `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`
      );
    }
  }
};
