export interface DynamoDBAttributeValue {
  b: null;
  bool: boolean;
  bs: Buffer[];
  isBOOLSet: boolean;
  isBSSet: boolean;
  isLSet: boolean;
  isMSet: boolean;
  isNSSet: boolean;
  isSSSet: boolean;
  l: DynamoDBAttributeValue[];
  m: Record<string, DynamoDBAttributeValue>;
  n: string | null;
  ns: string[];
  null: boolean;
  s: string | null;
  ss: string[];
}

export interface DynamoDBItem {
  Id: DynamoDBAttributeValue;
  Name: DynamoDBAttributeValue;
  Email: DynamoDBAttributeValue;
  Role: DynamoDBAttributeValue;
  Bio: DynamoDBAttributeValue;
  PhoneNumber: DynamoDBAttributeValue;
  AuditionDate: DynamoDBAttributeValue;
  AuditionNotes: DynamoDBAttributeValue;
  PreviousExperience: DynamoDBAttributeValue;
  WeekdayAvailability: DynamoDBAttributeValue;
  WeekendAvailability: DynamoDBAttributeValue;
  SpecialConsiderations: DynamoDBAttributeValue;
  ClerkUserId: DynamoDBAttributeValue;
  CreatedAt: DynamoDBAttributeValue;
  UpdatedAt: DynamoDBAttributeValue;
}
