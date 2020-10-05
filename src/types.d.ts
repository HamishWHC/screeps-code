// example declaration file - remove these and add your own custom typings

type TaskId<T extends TaskType> = string & Tag.OpaqueTag<T>

// memory extension samples
interface CreepMemory {
    taskTypeWhitelist: TaskType[],
    taskData: TaskData<TaskType>
}

interface TaskData<T extends TaskType> {
    taskId: TaskId<T>,
    type: T
}

interface GenesisTaskData extends TaskData<TaskType.GENESIS> {
    taskId: TaskId<TaskType.GENESIS>,
    type: TaskType.GENESIS,
    role: "spawn-fill" | "upgrader" | "repairer" | "builder"
}

declare enum TaskPriority {
    CRITICAL = 10,
    HIGH = 7,
    MID = 6,
    LOW = 5
}

declare enum GenesisRoles {
    SPAWN_FILL = "spawn-fill",
    BUILDER = "builder",
    UPGRADER = "upgrader"
}

declare enum TaskType {
    HARVEST = "harvest",
    TRANSPORT = "transport",
    BUILD = "build",
    REPAIR = "repair",
    UPGRADE = "upgrade",
    GENESIS = "genesis"
}

interface Task<T extends TaskType> {
    priority: TaskPriority,
    requiredParts: BodyPartConstant[],
    preferredParts: BodyPartConstant[],
    type: T
}

type CardinalDirection = "N" | "S" | "E" | "W" // For use with TS 4.1 template literal types... when it comes out :(

type RoomName = string // `${CardinalDirection}${number}${CardinalDirection}${number}`

interface Location {
    room: RoomName,
    x: number,
    y: number
}

interface GenesisTask extends Task<TaskType.GENESIS> {
    type: TaskType.GENESIS,
    spawnId: string,
    controllerId: Id<StructureController>,
    sourceIds: Id<Source>[]
}

interface HarvestTask extends Task<TaskType.HARVEST> {
    type: TaskType.HARVEST,
    sourceId: Id<Source>,
    containerIds: Id<StructureContainer>[]
}

type EnergyPickUp = StructureContainer | StructureLink | StructureStorage
type EnergyDropOff = StructureContainer | StructureLink | StructureStorage | StructureSpawn | StructureExtension | StructureLink

interface TransportTask extends Task<TaskType.TRANSPORT> {
    type: TaskType.TRANSPORT,
    pickUpIds: Id<EnergyPickUp>[],
    dropOffIds: Id<EnergyDropOff>[]
}

interface BuildTask extends Task<TaskType.BUILD> {
    type: TaskType.BUILD,
    siteIds: Id<Structure>[],
    pickUpIds: Id<EnergyPickUp>[]
}

interface RepairTask extends Task<TaskType.REPAIR> {
    type: TaskType.REPAIR,
    targetIds: Id<Structure>[],
    pickUpIds: Id<EnergyPickUp>[]
}

interface UpgradeTask extends Task<TaskType.UPGRADE> {
    type: TaskType.UPGRADE,
    controllerId: Id<StructureController>,
    resourceIds: Id<EnergyPickUp>[]
}

interface Memory {
    tasks: { [key: string]: Task<TaskType> },
    "genesis-mode": boolean
}

type TaskHandler<T extends TaskType> = (task: Task<T>, creep: Creep) => void

type TaskHandlers = {[key in TaskType]?: TaskHandler<key>}
type GenesisRoleHandlers = {[key in GenesisRoles]?: TaskHandler<TaskType.GENESIS>}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
