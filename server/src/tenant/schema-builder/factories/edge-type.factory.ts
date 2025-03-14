import { Injectable, Logger } from '@nestjs/common';

import { GraphQLOutputType } from 'graphql';

import { BuildSchemaOptions } from 'src/tenant/schema-builder/interfaces/build-schema-optionts.interface';
import { ObjectMetadataInterface } from 'src/tenant/schema-builder/interfaces/object-metadata.interface';

import {
  TypeMapperService,
  TypeOptions,
} from 'src/tenant/schema-builder/services/type-mapper.service';
import { TypeDefinitionsStorage } from 'src/tenant/schema-builder/storages/type-definitions.storage';
import { CursorScalarType } from 'src/tenant/schema-builder/graphql-types/scalars';

import { ObjectTypeDefinitionKind } from './object-type-definition.factory';
import { EdgeTypeDefinitionKind } from './edge-type-definition.factory';

@Injectable()
export class EdgeTypeFactory {
  private readonly logger = new Logger(EdgeTypeFactory.name);

  constructor(
    private readonly typeMapperService: TypeMapperService,
    private readonly typeDefinitionsStorage: TypeDefinitionsStorage,
  ) {}

  public create(
    objectMetadata: ObjectMetadataInterface,
    kind: EdgeTypeDefinitionKind,
    buildOtions: BuildSchemaOptions,
    typeOptions: TypeOptions,
  ): GraphQLOutputType {
    if (kind === EdgeTypeDefinitionKind.Cursor) {
      return this.typeMapperService.mapToGqlType(CursorScalarType, typeOptions);
    }

    const objectType = this.typeDefinitionsStorage.getObjectTypeByKey(
      objectMetadata.id,
      ObjectTypeDefinitionKind.Plain,
    );

    if (!objectType) {
      this.logger.error(
        `Node type for ${objectMetadata.nameSingular} was not found. Please, check if you have defined it.`,
        {
          objectMetadata,
          buildOtions,
        },
      );

      throw new Error(
        `Node type for ${objectMetadata.nameSingular} was not found. Please, check if you have defined it.`,
      );
    }

    return this.typeMapperService.mapToGqlType(objectType, typeOptions);
  }
}
