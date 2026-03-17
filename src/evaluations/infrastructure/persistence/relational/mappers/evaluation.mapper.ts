import { Evaluation } from '../../../../domain/evaluation';

import { EvaluationEntity } from '../entities/evaluation.entity';

export class EvaluationMapper {
  static toDomain(raw: EvaluationEntity): Evaluation {
    const domainEntity = new Evaluation();
    domainEntity.isValid = raw.isValid;

    domainEntity.textAr = raw.textAr;

    domainEntity.textFr = raw.textFr;

    domainEntity.stars = raw.stars;

    domainEntity.EvalCode = raw.evalCode;

    domainEntity.id = raw.id as string;
    domainEntity.createdAt = raw.createdAt as Date;
    domainEntity.updatedAt = raw.updatedAt as Date;

    return domainEntity;
  }

  static toPersistence(domainEntity: Evaluation): EvaluationEntity {
    const persistenceEntity = new EvaluationEntity();
    persistenceEntity.isValid = domainEntity.isValid;

    persistenceEntity.textAr = domainEntity.textAr;

    persistenceEntity.textFr = domainEntity.textFr;

    persistenceEntity.stars = domainEntity.stars;

    persistenceEntity.evalCode = domainEntity.EvalCode;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
