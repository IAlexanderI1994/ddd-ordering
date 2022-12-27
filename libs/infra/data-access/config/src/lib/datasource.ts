import {DataSource, DataSourceOptions} from "typeorm";
export let datasource: DataSource;

export const getDatasource = async (params?: DataSourceOptions): Promise<DataSource> => {

  if (!datasource && params) {
    datasource = await new DataSource(params).initialize()
  }
  return datasource;
}
