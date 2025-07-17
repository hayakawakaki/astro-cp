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

type ItemDatabaseInput = {
  Id: number;
  AegisName: string;
  Name: string;
  Buy?: number;
  Sell?: number;
  Weight?: number;
  Attack?: number;
  MagicAttack?: number;
  Defense?: number;
  Range?: number;
  Slots?: number;
  Jobs?: JobType | JobType[];
  Classes?: ClassType | ClassType[];
  Gender?: GenderType;
  Locations?: LocationType | LocationType[];
  WeaponLevel?: number;
  EquipLevelMin?: number;
  EquipLevelMax?: number;
  Refineable?: boolean;
  Gradable?: boolean;
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
  Image?: string;
  Description?: string[];
};

export type ItemDatabaseFormat
  = | (ItemDatabaseInput & { Type: "Weapon"; SubType: WeaponSubType })
    | (ItemDatabaseInput & { Type: "Ammo"; SubType: AmmoSubType })
    | (ItemDatabaseInput & { Type: "Card"; SubType?: CardSubType })
    | (ItemDatabaseInput & { Type: "Healing" | "Usable" | "Etc" | "Armor" | "PetEgg" | "PetArmor" | "DelayConsume" | "ShadowGear" | "Cash"; SubType: "None" });

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
