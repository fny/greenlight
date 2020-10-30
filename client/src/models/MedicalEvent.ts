import { DateTime } from 'luxon';
import {
  Model, attribute as attr, initialize, DATETIME, STRING,
} from './Model';

export enum MEDICAL_EVENTS {
  NONE = 'none',
  FEVER = 'fever',
  NEW_COUGH = 'new_cough',
  DIFFICULTY_BREATHING = 'difficulty_breathing',
  LOST_TASTE_SMELL = 'lost_taste_smell',
  CHILLS = 'chills',
  COVID_EXPOSURE = 'covid_exposure',
  COVID_TEST = 'covid_test',
  COVID_TEST_POSITIVE = 'covid_test_positive',
  COVID_TEST_NEGATIVE = 'covid_test_negative',
  COVID_DIAGNOSIS = 'covid_diagnosis',
  COVID_RULED_OUT = 'covid_ruled_out',
  SYMPTOM_IMPROVEMENT = 'symptom_improvement',
}

export class MedicalEvent extends Model {
  static singular = 'medical-event';

  static plural = 'medical-events';

  static TYPES = MEDICAL_EVENTS;

  static SYMPTOMS = [
    MEDICAL_EVENTS.FEVER,
    MEDICAL_EVENTS.NEW_COUGH,
    MEDICAL_EVENTS.LOST_TASTE_SMELL,
    MEDICAL_EVENTS.DIFFICULTY_BREATHING,
    MEDICAL_EVENTS.CHILLS,
  ];

  constructor(data?: any) {
    super();
    initialize(this, data);
  }

  @attr({ type: STRING })
  eventType: MEDICAL_EVENTS = MEDICAL_EVENTS.NONE;

  @attr({ type: DATETIME })
  occurredAt: DateTime = DateTime.fromISO('');

  @attr({ type: DATETIME })
  createdAt: DateTime = DateTime.fromISO('');
}

export function hasEvent(medicalEvents: MedicalEvent[], eventType: MEDICAL_EVENTS | MEDICAL_EVENTS[], lookbackDays: number) {
  return findEvents(medicalEvents, eventType, lookbackDays).length > 0;
}

export function findEvents(medicalEvents: MedicalEvent[], eventType: MEDICAL_EVENTS | MEDICAL_EVENTS[], lookbackDays: number) {
  const start = DateTime.local().minus({ days: lookbackDays });
  const eventTypes = Array.isArray(eventType) ? eventType : [eventType];
  return medicalEvents
    .filter((event) => event.occurredAt >= start)
    .filter((event) => eventTypes.includes(event.eventType));
}

export function findLastEvent(medicalEvents: MedicalEvent[], eventType: MEDICAL_EVENTS | MEDICAL_EVENTS[], lookbackDays: number) {
  const events = findEvents(medicalEvents, eventType, lookbackDays);
  return events.length > 0 ? events[-1] : null;
}
