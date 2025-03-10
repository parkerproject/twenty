import { Injectable, Logger } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { QueryBuilderOptions } from 'src/tenant/query-builder/interfaces/query-builder-options.interface';
import { Record as IRecord } from 'src/tenant/query-builder/interfaces/record.interface';
import { CreateManyResolverArgs } from 'src/tenant/query-builder/interfaces/resolvers-builder.interface';

import { stringifyWithoutKeyQuote } from 'src/tenant/query-builder/utils/stringify-without-key-quote.util';

import { FieldsStringFactory } from './fields-string.factory';
import { ArgsAliasFactory } from './args-alias.factory';

@Injectable()
export class CreateManyQueryFactory {
  private readonly logger = new Logger(CreateManyQueryFactory.name);

  constructor(
    private readonly fieldsStringFactory: FieldsStringFactory,
    private readonly argsAliasFactory: ArgsAliasFactory,
  ) {}

  create<Record extends IRecord = IRecord>(
    args: CreateManyResolverArgs<Record>,
    options: QueryBuilderOptions,
  ) {
    const fieldsString = this.fieldsStringFactory.create(
      options.info,
      options.fieldMetadataCollection,
    );
    const computedArgs = this.argsAliasFactory.create(
      args,
      options.fieldMetadataCollection,
    );

    return `
      mutation {
        insertInto${
          options.targetTableName
        }Collection(objects: ${stringifyWithoutKeyQuote(
      computedArgs.data.map((datum) => ({
        id: uuidv4(),
        ...datum,
      })),
    )}) {
          affectedCount
          records {
            ${fieldsString}
          }
        }
      }
    `;
  }
}
