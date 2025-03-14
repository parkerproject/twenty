import { ObjectType, ID, Field, HideField } from '@nestjs/graphql';

import {
  Authorize,
  CursorConnection,
  IDField,
  QueryOptions,
} from '@ptc-org/nestjs-query-graphql';

import { FieldMetadataDTO } from 'src/metadata/field-metadata/dtos/field-metadata.dto';

@ObjectType('object')
@Authorize({
  authorize: (context: any) => ({
    workspaceId: { eq: context?.req?.user?.workspace?.id },
  }),
})
@QueryOptions({
  defaultResultSize: 10,
  disableFilter: true,
  disableSort: true,
  maxResultsSize: 1000,
})
@CursorConnection('fields', () => FieldMetadataDTO)
export class ObjectMetadataDTO {
  @IDField(() => ID)
  id: string;

  @Field()
  dataSourceId: string;

  @Field()
  nameSingular: string;

  @Field()
  namePlural: string;

  @Field()
  labelSingular: string;

  @Field()
  labelPlural: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  icon: string;

  @Field()
  isCustom: boolean;

  @Field()
  isActive: boolean;

  @HideField()
  workspaceId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
