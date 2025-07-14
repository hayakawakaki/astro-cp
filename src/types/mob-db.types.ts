export type MobSize = "Small" | "Medium" | "Large";

export type MobEle
  = | "Neutral"
    | "Water"
    | "Earth"
    | "Fire"
    | "Wind"
    | "Poison"
    | "Holy"
    | "Dark"
    | "Ghost"
    | "Undead";

export type MobRace
    = | "Formless"
      | "Undead"
      | "Brute"
      | "Plant"
      | "Insect"
      | "Fish"
      | "Demon"
      | "Demihuman"
      | "Angel"
      | "Dragon";

export type MobDrop = {
  Item: string;
  Rate: number;
  StealProtected?: boolean;
  RandomOptionGroup?: string;
  Index?: number;
};

export type MobMvpDrop = {
  Item: string;
  Rate: number;
  RandomOptionGroup?: string;
  Index?: number;
};

// enum e_race2 : uint8 {
export type MobRaceGroup
  = | "None"
    | "Goblin"
    | "Kobold"
    | "Orc"
    | "Golem"
    | "Guardian"
    | "Ninja"
    | "Gvg"
    | "Battlefield"
    | "Treasure"
    | "Biolab"
    | "Manuk"
    | "Splendide"
    | "Scaraba"
    | "Ogh_Atk_Def"
    | "Ogh_Hidden"
    | "Bio5_Swordman_Thief"
    | "Bio5_Acolyte_Merchant"
    | "Bio5_Mage_Archer"
    | "Bio5_Mvp"
    | "Clocktower"
    | "Thanatos"
    | "Faceworm"
    | "Hearthunter"
    | "Rockridge"
    | "Werner_Lab"
    | "Temple_Demon"
    | "Illusion_Vampire"
    | "Malangdo"
    | "EP172ALPHA"
    | "EP172BETA"
    | "EP172BATH"
    | "Illusion_Turtle"
    | "Rachel_Sanctuary"
    | "Illusion_Luanda"
    | "Illusion_Frozen"
    | "Illusion_Moonlight"
    | "Ep16_Def"
    | "Edda_Arunafeltz"
    | "Lasagna"
    | "Glast_Heim_Abyss"
    | "Ch1Geffenia";

export type RaceGroupRecord = Partial<Record<MobRaceGroup, boolean>>;

export type MobMode
  = | "CanMove"
    | "Looter"
    | "Aggressive"
    | "Assist"
    | "CastSensorIdle"
    | "NoRandomWalk"
    | "NoCast"
    | "CanAttack"
    | "CastSensorChase"
    | "ChangeChase"
    | "Angry"
    | "ChangeTargetMelee"
    | "ChangeTargetChase"
    | "TargetWeak"
    | "RandomTarget"
    | "IgnoreMelee"
    | "IgnoreMagic"
    | "IgnoreRanged"
    | "Mvp"
    | "IgnoreMisc"
    | "KnockBackImmune"
    | "TeleportBlock"
    | "FixedItemDrop"
    | "Detector"
    | "StatusImmune"
    | "SkillImmune";

export type MobModeRecord = Partial<Record<MobMode, boolean>>;

export type MobDatabaseInput = {
  Id: number;
  AegisName: string;
  Name: string;
  JapaneseName?: string;
  Level: number;
  Hp: number;
  Sp: number;
  BaseExp: number;
  JobExp: number;
  MvpExp: number;
  Attack: number;
  Attack2?: number;
  Defense: number;
  MagicDefense: number;
  Resistance: number;
  MagicResistance: number;
  Str: number;
  Agi: number;
  Vit: number;
  Int: number;
  Dex: number;
  Luk: number;
  AttackRange: number;
  SkillRange: number;
  ChaseRange: number;
  Size: MobSize;
  Race: MobRace;
  RaceGroups?: RaceGroupRecord;
  Element: MobEle;
  ElementLevel: number;
  WalkSpeed: number;
  AttackDelay: number;
  AttackMotion: number;
  ClientAttackMotion?: number;
  DamageMotion: number;
  DamageTaken: number;
  GroupId?: number;
  Title?: string;
  Ai?: number;
  Class?: number;
  Modes?: MobModeRecord;
  MvpDrops?: MobDrop[];
  Drops?: MobMvpDrop[];
};

export type MobDatabase = Map<number, MobDatabaseInput>;

export type MobYAMLReturn = {
  Body: MobDatabaseInput[];
};
