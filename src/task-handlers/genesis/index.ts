import { handler as spawnFill } from "./spawn-fill"

const handlers: GenesisRoleHandlers = {
    [GenesisRoles.SPAWN_FILL]: spawnFill
}

export const handler: TaskHandler = (task, creep) => {
    const handler = handlers[creep.memory.taskData.role]
    if (handler) handler(task, creep)
}
