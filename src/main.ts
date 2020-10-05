import { handlers } from "task-handlers";
import { ErrorMapper } from "utils/ErrorMapper";

// const CREEP_BUILDERS: CreepBuilders = {
//     genesis: () => {
//         const [id,] = Object.entries(Memory.tasks).find(([id, task]) => task.type === TaskType.GENESIS) || [null]
//         if (!id) throw Error("Genesis task not present.")
//         return ["genesis", [CARRY, WORK, MOVE], {
//             taskId: id,
//             taskTypeWhitelist: [TaskType.GENESIS]
//         }]
//     },
//     transporter: () => ["transporter", [CARRY, CARRY, MOVE, MOVE]],
//     worker: () => ["worker", [WORK, WORK, CARRY, MOVE]],
//     combat: () => ["combat-basic", [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE]]
// }

const generateCreepName = (prefix: string) => {
    return `${prefix}-${Game.time}`
}

export const loop = ErrorMapper.wrapLoop(() => {
    const GENESIS_MODE = !!Memory["genesis-mode"]

    if (GENESIS_MODE && !Object.entries(Memory.tasks).find(([id, task]) => task.type === TaskType.GENESIS)) {
        Memory.tasks[`genesis-${Game.time}`] = {
            type: TaskType.GENESIS,
            spawnId: Game.spawns[0].id,
            priority: TaskPriority.CRITICAL,
            requiredParts: [CARRY, MOVE, WORK],
            preferredParts: [CARRY, MOVE, WORK],
            controllerId: Game.spawns[0].room.controller?.id,
            sourceIds: Game.spawns[0].room.find(FIND_SOURCES).map(src => src.id)
        } as GenesisTask
    }

    console.log(`Beginning game tick ${Game.time}.${GENESIS_MODE ? " Genesis Mode Enabled." : ""}`);
    console.log(`Current creep summary: ${Object.keys(Game.creeps).length} total`)
    Object.entries(Game.creeps).forEach(([name, creep]) => console.log(
        `${name} (${creep.body.map(bodyPart => bodyPart.boost ? bodyPart.type[0].toUpperCase() : bodyPart.type[0]).join("")}): ${creep.memory.taskData.taskId}`
    ))

    Object.values(Game.spawns).forEach(
        spawn => {
            if (!spawn.spawning && GENESIS_MODE) spawn.spawnCreep([WORK, CARRY, MOVE], generateCreepName("genesis"), {
                memory: {
                    taskData: {
                        taskId: Object.entries(Memory.tasks).find(([id, task]) => task.type === TaskType.GENESIS)![0] as TaskId<TaskType.GENESIS>,
                        type: TaskType.GENESIS,
                        role: "spawn-fill"
                    } as GenesisTaskData,
                    taskTypeWhitelist: [TaskType.GENESIS]
                }
            })
        }
    )

    Object.values(Game.creeps).forEach(creep => {
        const task = Memory.tasks[creep.memory.taskData.taskId]
        if (task) {
            const handler = handlers[task.type]
            if (handler) handler(task, creep)
        }
    })

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
});
