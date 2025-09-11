export type WeaponSubType
  = | "Fist"
    | "Dagger"
    | "1hSword"
    | "2hSword"
    | "1hSpear"
    | "2hSpear"
    | "1hAxe"
    | "2hAxe"
    | "Mace"
    | "Staff"
    | "Bow"
    | "Knuckle"
    | "Musical"
    | "Whip"
    | "Book"
    | "Katar"
    | "Revolver"
    | "Rifle"
    | "Gatling"
    | "Shotgun"
    | "Grenade"
    | "Huuma"
    | "2hStaff";

export type AmmoSubType
  = | "Arrow"
    | "Dagger"
    | "Bullet"
    | "Shell"
    | "Grenade"
    | "Shuriken"
    | "Kunai"
    | "CannonBall"
    | "ThrowWeapon";

export type CardSubType
  = | "Normal"
    | "Enchant";

export type JobType
  = | "All"
    | "Acolyte"
    | "Alchemist"
    | "Archer"
    | "Assassin"
    | "BardDancer"
    | "Blacksmith"
    | "Crusader"
    | "Gunslinger"
    | "Hunter"
    | "KagerouOboro"
    | "Knight"
    | "Mage"
    | "Merchant"
    | "Monk"
    | "Ninja"
    | "Novice"
    | "Priest"
    | "Rebellion"
    | "Rogue"
    | "Sage"
    | "SoulLinker"
    | "StarGladiator"
    | "Summoner"
    | "SuperNovice"
    | "Swordman"
    | "Taekwon"
    | "Thief"
    | "Wizard";

export type ClassType
  = | "All"
    | "Normal"
    | "Upper"
    | "Baby"
    | "Third"
    | "Third_Upper"
    | "Third_Baby"
    | "Fourth"
    | "All_Upper"
    | "All_Baby"
    | "All_Third";

export type GenderType
  = | "Female"
    | "Male"
    | "Both";

export type LocationType
  = | "Head_Top"
    | "Head_Mid"
    | "Head_Low"
    | "Armor"
    | "Right_Hand"
    | "Left_Hand"
    | "Garment"
    | "Shoes"
    | "Right_Accessory"
    | "Left_Accessory"
    | "Costume_Head_Top"
    | "Costume_Head_Mid"
    | "Costume_Head_Low"
    | "Costume_Garment"
    | "Ammo"
    | "Shadow_Armor"
    | "Shadow_Weapon"
    | "Shadow_Shield"
    | "Shadow_Shoes"
    | "Shadow_Right_Accessory"
    | "Shadow_Left_Accessory"
    | "Both_Hand"
    | "Both_Accessory";

export type ItemFlags = {
  BuyingStore?: boolean;
  DeadBranch?: boolean;
  Container?: boolean;
  UniqueId?: boolean;
  BindOnEquip?: boolean;
  DropAnnounce?: boolean;
  NoConsume?: boolean;
  DropEffect?: boolean;
};

export type ItemDelay = {
  Duration: number;
  Status: string;
};

export type ItemStack = {
  Amount: number;
  Inventory?: boolean;
  Cart?: boolean;
  Storage?: boolean;
  GuildStorage?: boolean;
};

export type ItemNoUse = {
  Override?: number;
  Sitting?: boolean;
};

export type ItemTrade = {
  Override?: number;
  NoDrop?: boolean;
  NoTrade?: boolean;
  TradePartner?: boolean;
  NoSell?: boolean;
  NoCart?: boolean;
  NoStorage?: boolean;
  NoGuildStorage?: boolean;
  NoMail?: boolean;
  NoAuction?: boolean;
};

export type TradeDisplay = Record<keyof Omit<ItemTrade, "Override">, string>;

type ItemEquipment = {
  EquipLevelMin?: number;
  EquipLevelMax?: number;
  Slots?: number;
  Refineable?: boolean;
  Gradable?: boolean;
  Attack?: number;
  MagicAttack?: number;
  Defense?: number;
};

type ItemDatabaseInput = {
  Id: number;
  AegisName: string;
  Name: string;
  Buy?: number;
  Sell?: number;
  Weight?: number;
  Jobs?: JobType | JobType[];
  Classes?: ClassType | ClassType[];
  Gender?: GenderType;
  View?: number;
  AliasName?: string;
  Flags?: ItemFlags;
  Delay?: ItemDelay;
  Stack?: ItemStack;
  NoUse?: ItemNoUse;
  Trade?: ItemTrade;
  Script?: string;
  EquipScript?: string;
  UnEquipScript?: string;
  ClientName?: string;
  Image?: string;
  Description?: string[];
};

export type ItemType
 = | "Weapon"
   | "Ammo"
   | "Card"
   | "Healing"
   | "Usable"
   | "Etc"
   | "Armor"
   | "PetEgg"
   | "PetArmor"
   | "DelayConsume"
   | "ShadowGear"
   | "Cash";

type WeaponFormat
  = ItemDatabaseInput
    & ItemEquipment
    & {
      Type: "Weapon";
      SubType: WeaponSubType;
      WeaponLevel: 1 | 2 | 3 | 4 | 5;
      Range: number;
      Locations: Extract<LocationType, "Right_Hand" | "Left_Hand" | "Both_Hand">;
    };

type ArmorFormat
  = ItemDatabaseInput
    & ItemEquipment
    & {
      Type: "Armor";
      SubType: "None";
      ArmorLevel: 1 | 2;
      Locations: Exclude<LocationType, "Right_Hand" | "Both_Hand" | "Ammo">;
    };

type CardFormat
  = ItemDatabaseInput
    & {
      Type: "Card";
      SubType: CardSubType;
      Location: LocationType;
    };

export type ItemDatabaseFormat
  = | WeaponFormat
    | ArmorFormat
    | CardFormat
    | (ItemDatabaseInput & { Type: "Ammo"; SubType: AmmoSubType })
    | (ItemDatabaseInput & { Type: "Usable"; SubType?: "None"; EquipLevelMin: number })
    | (ItemDatabaseInput & { Type: "Healing" | "Etc" | "PetEgg" | "PetArmor" | "DelayConsume" | "ShadowGear" | "Cash"; SubType: "None" });

export type ItemYAMLReturn = {
  Body: ItemDatabaseFormat[];
};

export type ItemInfoInput = {
  unidentifiedDisplayName: string;
  unidentifiedResourceName: string;
  unidentifiedDescriptionName: string[];
  identifiedDisplayName: string;
  identifiedResourceName: string;
  identifiedDescriptionName: string[];
  slotCount: number;
  ClassNum: number;
  costume: boolean;
};

export type WhoDropFormat = {
  mobId: number;
  dropRate: number;
};

export type ItemInfoLUA = Map<number, ItemInfoInput>;
export type ItemDatabase = Map<number | string, ItemDatabaseFormat>;
export type DropDatabase = Map<number, Set<WhoDropFormat>>;

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

export type MobDatabaseFormat = {
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
  Drops?: MobDrop[];
  MvpDrops?: MobMvpDrop[];
};

export type MobDatabase = Map<number, MobDatabaseFormat>;

export type MobYAMLReturn = {
  Body: MobDatabaseFormat[];
};

export type MobSearch = {
  id: number;
  name: string;
  aegisName: string;
};

export type OnlineCount = {
  onlineCount: number;
  totalOnlineCount: number;
  gmCount: number;
  vendorCount: number;
  uniqueCount: number;
};

export type ServerStatusReturn = {
  loginStatus: boolean;
  charStatus: boolean;
  mapStatus: boolean;
} & OnlineCount;

export type GetDBInfo<T> = keyof T | undefined;
export type GetDBInfoReturn<T, K> = K extends undefined
  ? T
  : K extends keyof T
    ? T[K]
    : never;

export type { JobNames } from "./client-jobnames";
