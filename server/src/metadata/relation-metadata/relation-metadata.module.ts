import { Module } from '@nestjs/common';

import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';

import { FieldMetadataModule } from 'src/metadata/field-metadata/field-metadata.module';
import { ObjectMetadataModule } from 'src/metadata/object-metadata/object-metadata.module';
import { TenantMigrationRunnerModule } from 'src/tenant-migration-runner/tenant-migration-runner.module';
import { TenantMigrationModule } from 'src/metadata/tenant-migration/tenant-migration.module';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

import { RelationMetadataService } from './relation-metadata.service';
import { RelationMetadataEntity } from './relation-metadata.entity';

import { CreateRelationInput } from './dtos/create-relation.input';
import { RelationMetadataDTO } from './dtos/relation-metadata.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature(
          [RelationMetadataEntity],
          'metadata',
        ),
        ObjectMetadataModule,
        FieldMetadataModule,
        TenantMigrationRunnerModule,
        TenantMigrationModule,
      ],
      services: [RelationMetadataService],
      resolvers: [
        {
          EntityClass: RelationMetadataEntity,
          DTOClass: RelationMetadataDTO,
          ServiceClass: RelationMetadataService,
          CreateDTOClass: CreateRelationInput,
          enableTotalCount: true,
          pagingStrategy: PagingStrategies.CURSOR,
          read: { many: { disabled: true } },
          create: { many: { disabled: true } },
          update: { disabled: true },
          delete: { disabled: true },
          guards: [JwtAuthGuard],
        },
      ],
    }),
  ],
  providers: [RelationMetadataService],
  exports: [RelationMetadataService],
})
export class RelationMetadataModule {}
